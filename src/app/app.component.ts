import { Component, PLATFORM_ID, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar.component';
import { Footer } from "./components/footer.component";
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    template: `
    <app-navbar />
    <div class="min-h-screen">
      <router-outlet />
    </div>
    <app-footer />
  `,
    imports: [RouterOutlet, Navbar, Footer]
})
export class AppComponent {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
}
