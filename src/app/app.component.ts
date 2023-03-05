import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, HighlightModule]
})
export class AppComponent {
  title = 'just-angular';

  helloWorldCode = import('./source-code/hello-world').then(m => m.default);
}
