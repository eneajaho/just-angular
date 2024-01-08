import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="bg-gray-800 flex space-x-4 items-center justify-center py-4">
      <a
        routerLink="/"
        [routerLinkActiveOptions]="{ exact: true }"
        routerLinkActive="bg-gray-900 text-white"
        ariaCurrentWhenActive="page"
        style="font-family: 'DM Mono', monospace;"
        class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 font-medium"
      >
        justangular.com
      </a>
      @for (navItem of navItems; track navItem.url) {
      <a
        [routerLink]="navItem.url"
        [routerLinkActiveOptions]="{ exact: true }"
        routerLinkActive="bg-gray-900 text-white"
        ariaCurrentWhenActive="page"
        class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 font-medium"
      >
        {{ navItem.label }}
      </a>
      }
    </nav>
  `,
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  navItems = [
    { url: '/blog', label: 'Blog' },
    { url: '/about', label: 'About' },
  ];
}
