import { Component, PLATFORM_ID, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar.component';
import { Footer } from './components/footer.component';
import { ScrollToTop } from './components/scroll-to-top.component';
import { ThemeService } from './theme.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-navbar />
    <main class="min-h-screen">
      <router-outlet />
    </main>
    <app-footer />
    <app-scroll-to-top />
  `,
  imports: [RouterOutlet, Navbar, Footer, ScrollToTop],
})
export class AppComponent {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  // Instantiate so theme is applied/persisted app-wide.
  private theme = inject(ThemeService);
}
