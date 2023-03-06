import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { WebContainer } from '@webcontainer/api';
import { DomSanitizer } from '@angular/platform-browser';
import { files } from './component-intro.files';

@Component({
  selector: 'app-component-intro',
  template: `
    <div class="grid grid-cols-2" style="border-radius: 5px;
    overflow: hidden;
    padding: 10px;
    background: white;
    box-shadow: 0px 2px 6px 0px #dddddd;"> 
      <div>

        <ngx-monaco-editor 
          style="height: 200px"
          [options]="editorOptions" 
          [ngModel]="code" 
          (ngModelChange)="codeChanged($event)" 
        />
      </div>


      <div style="
      margin: 10px;
      border-radius: 5px;
    overflow: hidden;
    padding: 10px;
    background: white;
    box-shadow: 0px 2px 6px 0px #dddddd;">
      <iframe [src]="previewIframeSrc" class="w-full"></iframe>

      </div>
  </div>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorModule],
})
export class ComponentIntro {
  cdr = inject(ChangeDetectorRef);
  sanitizer = inject(DomSanitizer);

  previewIframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
    'assets/loading.html'
  );

  editorOptions = {
    theme: 'vs',
    language: 'typescript',
    wordWrap: 'on',
    minimap: { enabled: false },
    folding: false,
    lineNumbersMinChars: 3,
    fontSize: 16,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabCompletion: 'on',
  };

  code: string = '';

  private webContainerInstance!: WebContainer;

  async ngOnInit() {
    this.code = (files as any)['src']['directory'][
      'app.component.ts'
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
    // Update the code
    this.code = newCode;
    // Write new code to the file system
    await this.webContainerInstance.fs.writeFile(
      'src/app.component.ts',
      newCode
    );
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

  ngOnDestroy() {
    // Stop the dev server
    this.webContainerInstance.teardown();
  }
}
