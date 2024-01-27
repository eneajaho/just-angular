import { Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import PostAttributes from '../../post-attributes';
import { RouterLink } from '@angular/router';
import { Breadcrumbs } from '../../components/breadcrumb.component';
import { RouteMeta } from '@analogjs/router';
import { DatePipe } from '@angular/common';

export const routeMeta: RouteMeta = {
  title: 'All Blog Posts - justangular.com',
};

@Component({
  selector: 'app-blog',
  standalone: true,
  template: `
    <div class="w-full hidden md:block">
      <app-breadcrumbs [breadcrumbs]="[{ url: '/blog', label: 'Blog' }]" />
    </div>

    <div class="py-20 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-4xl">
          <h2
            class="text-3xl font-bold tracking-tight text-gray-200 sm:text-4xl"
          >
            Blog posts 🍒
          </h2>
          <p class="mt-2 text-lg leading-8 text-gray-400">
            Grow your Angular development skills with our carefully curated
            posts.
          </p>
          <div class="mt-16 space-y-10 lg:mt-20 lg:space-y-20">
            @for (post of posts;track post.attributes.slug) {
            <article class="relative isolate flex flex-col gap-8 lg:flex-row">
              <div
                class="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0"
              >
                <div
                  [routerLink]="[post.attributes.slug]"
                  class="absolute inset-0 rounded-2xl ring-1 ring-inset cursor-pointer ring-gray-900/10"
                >
                  <img
                    [src]="post.attributes.coverImage"
                    [alt]="post.attributes.description"
                    loading="lazy"
                    style="view-transition-name: {{ post.attributes.slug }}"
                    class="cursor-pointer absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                  />
                </div>
              </div>
              <div>
                <div class="flex items-center gap-x-4 text-xs">
                  <time datetime="2020-03-16" class="text-gray-400">
                    {{ post.attributes.publishedAt | date }}
                  </time>
                </div>
                <div class="group relative max-w-xl">
                  <h3
                    class="mt-3 text-lg font-semibold leading-6 group-hover:text-gray-600"
                  >
                    <a
                      [routerLink]="[post.attributes.slug]"
                      style="color: white"
                    >
                      <span class="absolute inset-0"></span>
                      {{ post.attributes.title }}
                    </a>
                  </h3>
                  <p class="my-5 text-sm leading-6 text-gray-300">
                    {{ post.attributes.description }}
                  </p>
<!-- 
                  <div class="flex space-x-2 overflow-x-scroll">
                    @for (tag of post.attributes.tags; track tag) {
                    <a
                      [routerLink]="[]"
                      [queryParams]="{ tag }"
                      class="relative z-10 rounded-full bg-gray-800 px-3 py-1.5 font-medium text-gray-200 hover:bg-black-500"
                    >
                      {{ tag }}
                    </a>
                    }
                  </div> -->
                </div>
              </div>
            </article>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [RouterLink, Breadcrumbs, DatePipe],
})
export default class HomeComponent {
  readonly posts = injectContentFiles<PostAttributes>()
    .filter((article) => new Date() > new Date(article.attributes.publishedAt))
    .sort((a1, a2) =>
      a1.attributes.publishedAt > a2.attributes.publishedAt ? -1 : 1
    );
}
