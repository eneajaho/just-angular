import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="theme.toggle()"
      class="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink/70 hover:text-ink hover:border-ink/30 transition-colors"
      [attr.aria-label]="
        theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      "
      title="Toggle theme"
    >
      @if (theme.theme() === 'dark') {
        <!-- sun -->
        <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      } @else {
        <!-- moon -->
        <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      }
    </button>
  `,
})
export class ThemeToggle {
  theme = inject(ThemeService);
}
