import {
  AfterViewChecked,
  Component,
  OnDestroy,
  PLATFORM_ID,
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
import { AsyncPipe, DatePipe, isPlatformBrowser } from '@angular/common';

import PostAttributes from '../../post-attributes';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { SeoService } from '../../seo.service';
import { PreviousArticles } from './prev-articles.component';
import { LinkService } from '../../head-link.service';
import { Breadcrumbs } from '../../components/breadcrumb.component';
import { ReadingProgress } from '../../components/reading-progress.component';
import { TableOfContents } from '../../components/table-of-contents.component';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  template: `
    @if (post$ | async; as post) {
      <app-reading-progress />

      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div class="hidden md:block">
          <app-breadcrumbs
            [breadcrumbs]="[
              { url: '/blog', label: 'Blog' },
              { url: '/blog/' + post.attributes.slug, label: post.attributes.title }
            ]"
          />
        </div>

        <div class="relative mx-auto max-w-3xl">
          <!-- Table of contents (wide screens) -->
          <aside class="hidden xl:block absolute left-full top-0 h-full ml-12 w-56">
            <div class="sticky top-24">
              <app-toc />
            </div>
          </aside>

          <!-- Cover -->
          <img
            class="cover-image mt-4"
            style="view-transition-name: {{ post.attributes.slug }}"
            [src]="coverFor(post)"
            [alt]="post.attributes.description"
          />

          <!-- Meta -->
          <div class="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <span class="inline-flex items-center gap-1.5">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              {{ post.attributes.publishedAt | date: 'longDate' }}
            </span>
            <span class="h-1 w-1 rounded-full bg-muted/50"></span>
            <span class="inline-flex items-center gap-1.5">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {{ readingTime(post) }} min read
            </span>
          </div>

          <!-- Tags -->
          @if (post.attributes.tags?.length) {
            <div class="mt-4 flex flex-wrap gap-2">
              @for (tag of post.attributes.tags; track tag) {
                <a [routerLink]="['/blog']" [queryParams]="{ tag }" class="chip">{{ tag }}</a>
              }
            </div>
          }

          <!-- Body -->
          <article class="analog-markdown mt-6">
            <analog-markdown [content]="post.content" />
          </article>

          <hr />

          <!-- Share -->
          <div class="rounded-2xl border border-hairline bg-surface p-6 flex items-center justify-between flex-col sm:flex-row gap-5">
            <div class="text-lg font-serif font-semibold text-ink text-center sm:text-left">
              Found this helpful? Share it.
            </div>
            <div class="flex items-center gap-3">
              <a href="https://twitter.com/intent/tweet?text=Just read {{ post.attributes.title }}&url={{ postUrl }}&via=Enea_Jahollari"
                 target="_blank" rel="noopener" class="social-icon-link" aria-label="Share on X">
                <img src="/x.svg" alt="Share on X" class="social-icon" />
              </a>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url={{ postUrl }}"
                 target="_blank" rel="noopener" class="social-icon-link" aria-label="Share on LinkedIn">
                <img src="/linkedin.webp" alt="Share on LinkedIn" class="social-icon" />
              </a>
            </div>
          </div>

          <div class="giscus mt-12"></div>

          <app-previous-articles [posts]="previousArticles()" />
        </div>
      </div>
    }
  `,
  styleUrl: './slug.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    MarkdownComponent,
    PreviousArticles,
    Breadcrumbs,
    ReadingProgress,
    TableOfContents,
  ],
  providers: [LinkService],
})
export default class Blogpost implements OnDestroy, AfterViewChecked {
  private seoService = inject(SeoService);
  private linkService = inject(LinkService);
  private router = inject(Router);
  private theme = inject(ThemeService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly post$ = injectContent<PostAttributes>('slug');

  /** Theme-aware cover: use the light variant when present and the theme is light. */
  coverFor(
    post: ContentFile<PostAttributes | Record<string, never>>
  ): string {
    const attrs = post.attributes as PostAttributes;
    return this.theme.theme() === 'light' && attrs.coverImageLight
      ? attrs.coverImageLight
      : attrs.coverImage;
  }

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

  /** Rough reading time from the markdown word count. */
  readingTime(post: ContentFile<PostAttributes | Record<string, never>>): number {
    const content = typeof post.content === 'string' ? post.content : '';
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  }

  constructor() {
    this.post$.pipe(takeUntil(this.destroy$)).subscribe((post) => {
      this.post.set(post);

      this.seoService.generateTags({
        description: post.attributes.description,
        image: post.attributes.coverImage,
        title: post.attributes.title,
      });

      if (post.attributes.canonicalUrl) {
        this.linkService.addTag({
          rel: 'canonical',
          href: post.attributes.canonicalUrl,
          pageId: post.slug,
        });
      } else {
        this.linkService.removeLinks();
      }
    });
  }

  ngAfterViewChecked() {
    if (!this.isBrowser) return;
    document.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.copy-button')) {
        return;
      }

      const button = document.createElement('button');
      button.className = 'copy-button';
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.043m-7.416 0v3.043c0 .212.03.418.084.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
      </svg>
      `;
      pre.appendChild(button);
      pre.style.position = 'relative';

      button.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText;
        if (code) {
          navigator.clipboard.writeText(code);
          button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          `;
          setTimeout(() => {
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.043m-7.416 0v3.043c0 .212.03.418.084.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            `;
          }, 2000);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.linkService.removeLinks();
  }
}
