import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Breadcrumbs } from '../components/breadcrumb.component';

@Component({
  selector: 'app-about',
  template: `
    <div class="w-full hidden md:block">
      <app-breadcrumbs [breadcrumbs]="[{ url: '/about', label: 'About' }]" />
    </div>

    <div class="grid place-items-center mt-10 text-2xl">
      <p class="text-gray-400 mb-[100px]"></p>

      Brought to you by
      <a href="https://x.com/Enea_Jahollari">Enea Jahollari</a>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumbs],
})
export default class AboutComponent {}
