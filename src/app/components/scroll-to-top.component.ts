import {
  Component,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
  signal,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <button
        type="button"
        class="to-top animate-fade-in-up"
        (click)="scrollTop()"
        aria-label="Scroll to top"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    }
  `,
})
export class ScrollToTop {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  visible = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    if (this.isBrowser) {
      this.visible.set(window.scrollY > 600);
    }
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
