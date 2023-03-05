const code = `import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: \`
    <div>Getting started with Angular!</div>
    <button (click)="onClick()">Start here!</button>
  \`,
  standalone: true
})
export class AppComponent {

  onClick() {
    alert('Hello World!');
  }

}

bootstrapApplication(AppComponent);
`;

export default code;