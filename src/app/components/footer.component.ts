import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="mt-24 border-t border-hairline bg-paper/60">
      <div class="max-w-6xl mx-auto px-6 lg:px-8 py-14">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <!-- Brand -->
          <div class="max-w-sm">
            <a routerLink="/" class="font-serif text-2xl font-semibold tracking-tight text-ink">
              justangular<span class="text-accent">.com</span>
            </a>
            <p class="mt-3 text-muted leading-7">
              Careful, practical writing on modern Angular — signals, change detection,
              resources, SSR and everything in between.
            </p>
            <div class="mt-5 flex items-center gap-3">
              <a href="https://twitter.com/Enea_Jahollari" target="_blank" rel="noopener"
                 class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-muted hover:text-ink hover:border-ink/30 transition-colors"
                 aria-label="Twitter / X">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="https://github.com/eneajahollari" target="_blank" rel="noopener"
                 class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-muted hover:text-ink hover:border-ink/30 transition-colors"
                 aria-label="GitHub">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          <!-- Nav columns -->
          <div class="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <p class="eyebrow">Explore</p>
              <ul class="mt-4 space-y-2.5">
                <li><a routerLink="/blog" class="text-muted hover:text-ink transition-colors">Blog</a></li>
                <li><a routerLink="/about" class="text-muted hover:text-ink transition-colors">About</a></li>
                <li><a routerLink="/privacy-policy" class="text-muted hover:text-ink transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <p class="eyebrow">Elsewhere</p>
              <ul class="mt-4 space-y-2.5">
                <li><a href="https://twitter.com/Enea_Jahollari" target="_blank" rel="noopener" class="text-muted hover:text-ink transition-colors">Twitter / X ↗</a></li>
                <li><a href="https://github.com/eneajahollari" target="_blank" rel="noopener" class="text-muted hover:text-ink transition-colors">GitHub ↗</a></li>
                <li><a href="https://ko-fi.com/eneajahollari" target="_blank" rel="noopener" class="text-muted hover:text-ink transition-colors">Buy me a coffee ↗</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-12 pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
          <p>© {{ year }} JustAngular. Built by
            <a href="https://twitter.com/Enea_Jahollari" target="_blank" rel="noopener" class="text-ink hover:text-accent transition-colors">Enea Jahollari</a>.
          </p>
          <p>
            Powered by
            <a href="https://analogjs.org" target="_blank" rel="noopener" class="text-ink hover:text-accent transition-colors">Analog.js</a>
            &amp;
            <a href="https://angular.dev" target="_blank" rel="noopener" class="text-ink hover:text-accent transition-colors">Angular</a>
          </p>
        </div>
      </div>
    </footer>
  `,
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  year = new Date().getFullYear();
}
