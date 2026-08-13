import {
  Injectable,
  PLATFORM_ID,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly theme = signal<Theme>('light');

  constructor() {
    if (this.isBrowser) {
      const stored = localStorage.getItem('theme') as Theme | null;
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.theme.set(stored ?? (prefersDark ? 'dark' : 'light'));

      // Keep <html>.dark and localStorage in sync with the signal.
      effect(() => {
        const theme = this.theme();
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
        // Nudge the giscus comment embed to match, if present.
        this.syncGiscus(theme);
      });
    }
  }

  toggle() {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private syncGiscus(theme: Theme) {
    const iframe = document.querySelector<HTMLIFrameElement>(
      'iframe.giscus-frame'
    );
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    );
  }
}
