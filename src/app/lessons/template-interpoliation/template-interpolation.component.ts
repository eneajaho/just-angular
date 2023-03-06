import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { WebContainer } from '@webcontainer/api';
import { DomSanitizer } from '@angular/platform-browser';
import { files } from './template-interpolation.files';

@Component({
  selector: 'app-template-interpolation',
  template: `

    <ul>
    <li (click)="setCurrentFile('src/main.ts')">
        main.ts
      </li>
      <li (click)="setCurrentFile('src/interpolation.html')">
        interpolation.html
      </li>
    </ul>

    <div class="grid gap-5"> 
      <ngx-monaco-editor 
        [options]="editorOptions" 
        [ngModel]="code" 
        (ngModelChange)="codeChanged($event)" 
      />

      <iframe [src]="previewIframeSrc"></iframe>
  </div>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorModule],
})
export class TemplateInterpolation {
  cdr = inject(ChangeDetectorRef);
  sanitizer = inject(DomSanitizer);

  currentFile = 'src/interpolation.html';

  previewIframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
    'assets/loading.html'
  );

  editorOptions = {
    theme: 'vs-dark',
    language: 'html',
    wordWrap: 'on',
    minimap: {
      enabled: false,
    },
    showUnused: false,
    folding: false,
    lineNumbersMinChars: 3,
    fontSize: 14,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabCompletion: 'on',
    noSemanticValidation: true,
    noSyntaxValidation: true,
  };

  code: string = '';

  private webContainerInstance!: WebContainer;

  async ngOnInit() {
    this.code = (files as any)['src']['directory'][
      'interpolation.html'
    ].file.contents;

    this.webContainerInstance = await WebContainer.boot();

    await this.webContainerInstance.mount(files);

    const exitCode = await this.installDependencies();
    if (exitCode !== 0) {
      throw new Error('Installation failed');
    }

    await this.startDevServer();
  }

  async codeChanged(newCode: string) {
    // Write new code to the file system
    await this.webContainerInstance.fs.writeFile(this.currentFile, newCode);
    // Update the code
    this.code = newCode;
  }

  async setCurrentFile(file: string) {
    this.code = await this.webContainerInstance.fs.readFile(this.currentFile, 'utf8');
    this.currentFile = file;
  }

  async installDependencies() {
    // Install dependencies
    const installProcess = await this.webContainerInstance.spawn('npm', [
      'install',
    ]);
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
          // we can play with logs here
        },
      })
    );
    // Wait for install command to exit
    return installProcess.exit;
  }

  async startDevServer() {
    // Run `npm run start` to start the Express app
    await this.webContainerInstance.spawn('npm', ['run', 'start']);

    // Wait for `server-ready` event
    this.webContainerInstance.on('server-ready', (port, url) => {
      console.log(`Server ready on port ${port}`);
      this.previewIframeSrc =
        this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.cdr.detectChanges();
    });
  }
}
