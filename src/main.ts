import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';

const monacoConfig: NgxMonacoEditorConfig = {
  // baseUrl: 'app-name/assets', // configure base path cotaining monaco-editor directory after build default: './assets'
  defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
  onMonacoLoad: () => { 
    console.log((<any>window).monaco); 
    (<any>window).monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
};

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(MonacoEditorModule.forRoot(monacoConfig)),
  ]
})
  .catch(err => console.error(err));
