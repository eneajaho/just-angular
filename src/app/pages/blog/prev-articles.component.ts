import { ContentFile } from '@analogjs/content';
import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import PostAttributes from 'src/app/post-attributes';

@Component({
  selector: 'app-previous-articles',
  template: `
    <div class="py-10 sm:py-15 max-w-[800px] ">
      <div class="mx-auto max-w-7xl">
        <div class="mx-auto max-w-2xl text-center">
          <h2
            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Previous articles
          </h2>
          <p class="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Don't miss out on our previous articles.
          </p>
        </div>
        <div
          class="mx-auto mt-16 grid auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
        >
          @for (post of posts; track post.slug) {
          <article
            class="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
          >
            <img
              [src]="post.attributes.coverImage"
              [alt]="post.attributes.coverImageAlt"
              class="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div
              class="absolute inset-0 -z-10 bg-gradient-to-t from-gray-200 dark:from-gray-900 via-gray-200/40 dark:via-gray-900/40"
            ></div>
            <div
              class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"
            ></div>

            <div
              class="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-700 dark:text-gray-300"
            >
              <time
                [attr.datetime]="post.attributes.publishedAt | date"
                class="mr-8"
                >{{ post.attributes.publishedAt | date }}</time
              >
            </div>
            <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white">
              <a
                [routerLink]="['/blog', post.attributes.slug]"
                class="text-gray-900 dark:text-white"
              >
                <span class="absolute inset-0"></span>
                {{ post.attributes.title }}
              </a>
            </h3>
          </article>
          }
        </div>
      </div>
    </div>
  `,
  imports: [RouterLink, DatePipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviousArticles {
  @Input() posts: ContentFile<PostAttributes>[] = [];
}
