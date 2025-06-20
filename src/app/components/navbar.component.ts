import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="sticky top-0 z-50 glass !rounded-none border-b border-gray-200 dark:border-white/10 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo/Brand -->
          <div class="flex-shrink-0">
            <a
              routerLink="/"
              [routerLinkActiveOptions]="{ exact: true }"
              routerLinkActive="text-blue-600 dark:text-blue-400"
              ariaCurrentWhenActive="page"
              class="text-xl font-bold gradient-text hover:scale-105 transition-transform duration-200"
            >
              justangular.com
            </a>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              @for (navItem of navItems; track navItem.url) {
              <a
                [routerLink]="navItem.url"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                ariaCurrentWhenActive="page"
                class="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent hover:border-gray-300 dark:hover:border-white/20"
              >
                {{ navItem.label }}
              </a>
              }
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              type="button"
              class="p-2 rounded-lg transition-all duration-200 text-blue-100 dark:text-gray-300 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700"
              (click)="toggleMobileMenu()"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span class="sr-only">Open main menu</span>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        @if (mobileMenuOpen) {
        <div class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-white/10 mt-4">
            @for (navItem of navItems; track navItem.url) {
            <a
              [routerLink]="navItem.url"
              [routerLinkActiveOptions]="{ exact: true }"
              routerLinkActive="bg-blue-500/20 text-blue-600 dark:text-blue-400"
              ariaCurrentWhenActive="page"
              class="text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-white/10 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
            >
              {{ navItem.label }}
            </a>
            }
          </div>
        </div>
        }
      </div>
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

  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
