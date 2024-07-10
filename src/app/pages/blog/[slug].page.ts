import {
  Component,
  OnDestroy,
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
import { AsyncPipe, DatePipe, NgStyle } from '@angular/common';

import PostAttributes from '../../post-attributes';
import {  Subject, takeUntil } from 'rxjs';
import Breadcrumbs from '../../components/breadcrumb.analog';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SeoService } from '../../seo.service';
import { PreviousArticles } from './prev-articles.component';
import { LinkService } from '../../head-link.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  template: `
    @if (post$ | async; as post) {

    <div class="w-full hidden md:block">
      <Breadcrumbs
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
      <div class="mt-3">
        Published <b>{{ post.attributes.publishedAt | date: 'mediumDate' }}</b>
      </div>

      <article>
        <!-- <div class="flex space-x-4 overflow-x-auto">
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
        <analog-markdown [content]="post.content" />
        <!-- <div
          class="sticky top-0 sm:hidden lg:block"
          style="position: absolute; right: 50px; top: 25px"
        >
          <app-post-titles ngSkipHydration />
        </div> -->
      </article>

      <hr>

      <div style="display: flex;gap: 15px;align-items: center;">
        Share this article:
        <a
          href="https://twitter.com/intent/tweet?text=Just read {{ post.attributes.title }}&url={{postUrl}}&via=Enea_Jahollari"
          target="_blank"
          rel="noopener"
        >
          <img src="x.svg" alt="Share on Twitter" class="social-icon" />
        </a>
        <a
          href="https://www.linkedin.com/sharing/share-offsite/?url={{postUrl}}"
          target="_blank"
          rel="noopener"
        >
          <img src="linkedin.webp" alt="Share on LinkedIn" class="social-icon" />
        </a>

      </div>

      <div class="giscus"></div>

      <app-previous-articles [posts]="previousArticles()" />
    </div>
<!--
        <a href="https://ko-fi.com/A0A5KJQS4" target="_blank">
          <img src="kofi.png" alt="Buy me a coffee" class="kofi" />
        </a> -->
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
    DatePipe,
    MarkdownComponent,
    RouterLink,
    Breadcrumbs,
    NgStyle,
    RouterLinkActive,
    // PostTitles,
    PreviousArticles,
  ],
  providers: [LinkService]
})
export default class Blogpost implements OnDestroy {
  private seoService = inject(SeoService);
  private linkService = inject(LinkService);
  private router = inject(Router);
  readonly post$ = injectContent<PostAttributes>('slug');

  private destroy$ = new Subject<void>();

  postUrl = `https://justangular.com${this.router.url}`;

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

  constructor() {
    this.post$.pipe(takeUntil(this.destroy$)).subscribe((post) => {
      this.post.set(post);

      this.seoService.generateTags({
        description: post.attributes.description,
        image: post.attributes.coverImage,
        title: post.attributes.title,
      });

      if (post.attributes.canonicalUrl) {
        this.linkService.addTag( { rel: 'canonical', href: post.attributes.canonicalUrl, pageId: post.slug } );
      } else {
        this.linkService.removeLinks();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.linkService.removeLinks();
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
