import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-about',
  template: ` About me `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutComponent {}
