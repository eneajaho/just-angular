import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  template: `
    <nav class="py-4" aria-label="Breadcrumb">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol role="list" class="flex items-center space-x-2">
          <li>
            <a routerLink="/" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors duration-200 text-sm font-medium">
              Home
            </a>
          </li>

          @for (breadcrumb of breadcrumbs(); track breadcrumb.url) {
          <li>
            <div class="flex items-center">
              <svg
                class="h-4 w-4 flex-shrink-0 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"
                />
              </svg>
              <a
                [routerLink]="breadcrumb.url"
                class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors duration-200"
                >{{ breadcrumb.label }}</a
              >
            </div>
          </li>
          }
        </ol>
      </div>
    </nav>
  `,
  imports: [RouterLink],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumbs {
  breadcrumbs = input.required<Array<{ label: string; url: string }>>();
}

