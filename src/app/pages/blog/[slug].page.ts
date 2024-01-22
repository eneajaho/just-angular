import {
  Component,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  ContentFile,
  injectContent,
  injectContentFiles,
  MarkdownComponent,
} from '@analogjs/content';
import { AsyncPipe, NgStyle } from '@angular/common';

import { injectDestroy } from 'ngxtension/inject-destroy';

import PostAttributes from '../../post-attributes';
import { take, takeUntil } from 'rxjs';
import { Breadcrumbs } from '../../components/breadcrumb.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SeoService } from '../../seo.service';
import { PreviousArticles } from './prev-articles.component';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  template: `
    @if (post$ | async; as post) {

    <div class="w-full hidden md:block">
      <app-breadcrumbs
        [breadcrumbs]="[
          { url: '/blog', label: 'Blog' },
          { url: '/blog/' + post.attributes.slug, label: post.attributes.title }
        ]"
      />
    </div>

    <img
      class="cover-image"
      style="view-transition-name: {{ post.attributes.slug }}"
      [src]="post.attributes.coverImage"
      [alt]="post.attributes.description"
    />

    <div class="w-full grid justify-center relative" style="max-width: 100vw">
      <article>
        <div class="flex space-x-4">
          @for (tag of post.attributes.tags; track tag) {
          <a
            [routerLink]="[]"
            [queryParams]="{ tag }"
            class="relative z-10 rounded-full bg-gray-800 px-3 py-1.5 font-medium text-gray-200 hover:bg-black-500"
          >
            {{ tag }}
          </a>
          }
        </div>
        <analog-markdown [content]="content()" />
        <!-- <div
          class="sticky top-0 sm:hidden lg:block"
          style="position: absolute; right: 50px; top: 25px"
        >
          <app-post-titles ngSkipHydration />
        </div> -->
      </article>

      <app-previous-articles [posts]="previousArticles()" />
    </div>

    }
    <!-- @if (isDev && isBrowser) { -->
    <!-- <img class="post__image" [src]="post.attributes.coverImage" />
    @if (hasChanges()) {
    <button (click)="updateMarkdownFile()">Save Changes</button>
    }
    <div
      style="display: grid; grid-template-columns: 701px 700px; gap: 10px; width: 1400px"
    >
      <app-markdown-editor
        [content]="content()"
        (contentChange)="updateContent($event, markdownRenderer)"
      />
      <div style="max-width: 100%;">
        @if (loading()) {
        <analog-markdown [content]="previousContent()" />
        }
        <analog-markdown
          style="display: {{ loading() ? 'none' : 'block' }};"
          [content]="content()"
          #markdownRenderer
        />
      </div>
    </div>
    } @else { -->
  `,
  styleUrl: './slug.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    AsyncPipe,
    MarkdownComponent,
    RouterLink,
    Breadcrumbs,
    NgStyle,
    RouterLinkActive,
    // PostTitles,
    PreviousArticles,
  ],
})
export default class Blogpost {
  private seoService = inject(SeoService);
  readonly post$ = injectContent<PostAttributes>('slug');

  readonly allArticles = injectContentFiles<PostAttributes>()
    .filter((article) => new Date() > new Date(article.attributes.publishedAt))
    .sort((a1, a2) =>
      a1.attributes.publishedAt > a2.attributes.publishedAt ? -1 : 1
    );

  previousArticles = computed(() => {
    const post = this.post();
    if (!post) return [];

    // return only 2 last articles before the current one based on the published date
    return this.allArticles
      .filter((article) => {
        return (
          post.attributes.title !== article.attributes.title &&
          new Date() > new Date(article.attributes.publishedAt)
        );
      })
      .sort((a1, a2) =>
        a1.attributes.publishedAt > a2.attributes.publishedAt ? -1 : 1
      )
      .slice(0, 2);
  });

  post = signal<
    ContentFile<PostAttributes | Record<string, never>> | undefined
  >(undefined);

  content = signal<string>('');

  loading = signal(false);

  private destroy$ = injectDestroy();

  ngOnInit() {
    this.post$.pipe(takeUntil(this.destroy$)).subscribe((post) => {
      this.post.set(post);
      this.content.set(post.content || '');

      this.seoService.generateTags({
        description: post.attributes.description,
        image: post.attributes.coverImage,
        title: post.attributes.title,
      });
    });
  }

  // isDev = import.meta.env.MODE === 'development';
  // isBrowser = import.meta.env.SSR === false;
  // hasChanges = signal(false);
  // previousContent = computedPrevious(this.content);
  // lastUpdate?: ReturnType<typeof setTimeout>;

  // updateContent($event: string, markdownRenderer: MarkdownComponent) {
  //   this.content.set($event);
  //   this.hasChanges.set(true);
  //   this.loading.set(true);
  //   let times = 0;
  //   let interval = setInterval(() => {
  //     if (times > 3) {
  //       clearInterval(interval);
  //       this.loading.set(false);
  //     }
  //     this.cdr.detectChanges();
  //     times++;
  //     this.loading.set(false);
  //   }, 1000);
  // }
  // updateMarkdownFile() {
  //   const post = this.post();
  //   if (post) {
  //     this.http
  //       .post(`/api/updateContent`, {
  //         slug: post.attributes.slug,
  //         content: this.content(),
  //       })
  //       .subscribe((res) => {
  //         console.log(res);
  //         this.hasChanges.set(false);
  //       });
  //   }
  // }
}
