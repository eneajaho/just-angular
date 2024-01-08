import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  template: `
    <main
      class="grid min-h-full place-items-center  px-6 py-24 sm:py-32 lg:px-8"
    >
      <div class="text-center">
        <p class="text-base font-semibold text-indigo-200">404</p>
        <h1
          class="mt-4 text-3xl font-bold tracking-tight text-indigo-300 sm:text-5xl"
        >
          Page not found
        </h1>
        <p class="mt-6 text-base leading-7 text-gray-200">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <a
            routerLink="/"
            class="rounded-md bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm
             hover:bg-gray-500 hover:text-white focus-visible:outline"
          >
            Go back home
          </a>
        </div>
      </div>
    </main>
  `,
  imports: [RouterLink],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFound {}
