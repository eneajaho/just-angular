import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  signal,
  Input,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-markdown-editor',
  template: `
    <div style="height: 100%; width: 100%; border: 1px solid black">
      <div #ref></div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownEditorComponent {
  @ViewChild('ref', { static: true }) ref!: ElementRef<HTMLDivElement>;

  @Input() set content(value: string) {
    this.value.set(value);
  }

  @Output() contentChange = new EventEmitter<string>();

  editorRef?: import('monaco-editor').editor.IStandaloneCodeEditor;

  value = signal('');

  async ngOnInit() {
    const monaco = await import('monaco-editor');

    const editorWorker = await import(
      'monaco-editor/esm/vs/editor/editor.worker?worker'
    );

    self.MonacoEnvironment = {
      getWorker(_: string, label: string) {
        // @ts-ignore
        return new editorWorker();
      },
    };

    const options = {
      'semanticHighlighting.enabled': true,

      minimap: {
        enabled: false,
      },
    };

    this.editorRef = monaco.editor.create(this.ref.nativeElement, {
      value: this.value(),
      language: 'markdown',
      fontSize: 16,
      theme: 'vs-dark',
      wordWrap: 'on',
      ...options,
    });

    this.editorRef.onDidChangeModelContent((modelContentChangedEvent) => {
      this.value.set(this.editorRef!.getValue());
      this.contentChange.emit(this.value());
    });

    let ignoreEvent = false;
    let width = 700;
    const updateHeight = () => {
      const contentHeight = Math.min(1000, this.editorRef!.getContentHeight());
      this.ref.nativeElement.style.width = `${width}px`;
      this.ref.nativeElement.style.height = `${contentHeight}px`;
      try {
        ignoreEvent = true;
        this.editorRef!.layout({ width, height: contentHeight });
      } finally {
        ignoreEvent = false;
      }
    };
    this.editorRef!.onDidContentSizeChange(updateHeight);
    updateHeight();
  }
}
