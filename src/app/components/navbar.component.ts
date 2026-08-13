import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggle } from './theme-toggle.component';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="sticky top-0 z-50 bar">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Wordmark -->
          <a
            routerLink="/"
            [routerLinkActiveOptions]="{ exact: true }"
            routerLinkActive="!text-ink"
            class="font-serif text-xl font-semibold tracking-tight text-ink hover:opacity-80 transition-opacity"
          >
            justangular<span class="text-accent">.com</span>
          </a>

          <!-- Desktop nav -->
          <div class="hidden md:flex items-center gap-1">
            @for (navItem of navItems; track navItem.url) {
              <a
                [routerLink]="navItem.url"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="text-ink bg-ink/5"
                ariaCurrentWhenActive="page"
                class="px-3.5 py-2 rounded-full text-sm font-medium text-muted hover:text-ink hover:bg-ink/5 transition-colors"
              >
                {{ navItem.label }}
              </a>
            }
            <span class="mx-2 h-5 w-px bg-hairline"></span>
            <a
              href="https://twitter.com/Enea_Jahollari"
              target="_blank"
              rel="noopener"
              class="px-3.5 py-2 rounded-full text-sm font-medium text-muted hover:text-ink hover:bg-ink/5 transition-colors"
            >
              Twitter&nbsp;<span aria-hidden="true">↗</span>
            </a>
            <app-theme-toggle />
          </div>

          <!-- Mobile controls -->
          <div class="md:hidden flex items-center gap-2">
            <app-theme-toggle />
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink/70 hover:text-ink transition-colors"
              (click)="toggleMobileMenu()"
              aria-label="Open menu"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        @if (mobileMenuOpen) {
          <div class="md:hidden pb-4">
            <div class="flex flex-col gap-1 border-t border-hairline pt-3">
              @for (navItem of navItems; track navItem.url) {
                <a
                  [routerLink]="navItem.url"
                  [routerLinkActiveOptions]="{ exact: true }"
                  routerLinkActive="text-ink bg-ink/5"
                  ariaCurrentWhenActive="page"
                  (click)="mobileMenuOpen = false"
                  class="px-3 py-2.5 rounded-xl text-base font-medium text-muted hover:text-ink hover:bg-ink/5 transition-colors"
                >
                  {{ navItem.label }}
                </a>
              }
              <a
                href="https://twitter.com/Enea_Jahollari"
                target="_blank"
                rel="noopener"
                class="px-3 py-2.5 rounded-xl text-base font-medium text-muted hover:text-ink hover:bg-ink/5 transition-colors"
              >
                Twitter ↗
              </a>
            </div>
          </div>
        }
      </div>
    </nav>
  `,
  imports: [RouterLink, RouterLinkActive, ThemeToggle],
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
