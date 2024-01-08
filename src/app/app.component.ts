import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-navbar />
    <router-outlet />
  `,
  imports: [RouterOutlet, Navbar],
})
export class AppComponent {}
