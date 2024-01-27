import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar.component';
import { Footer } from "./components/footer.component";

@Component({
    selector: 'app-root',
    standalone: true,
    template: `
    <app-navbar />
    <router-outlet />
    <app-footer />
  `,
    imports: [RouterOutlet, Navbar, Footer]
})
export class AppComponent {}
