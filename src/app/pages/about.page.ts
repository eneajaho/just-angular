import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Breadcrumbs } from '../components/breadcrumb.component';

@Component({
  selector: 'app-about',
  template: `
    <div class="w-full hidden md:block">
      <app-breadcrumbs [breadcrumbs]="[{ url: '/about', label: 'About' }]" />
    </div>

    About me
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumbs],
})
export default class AboutComponent {}
