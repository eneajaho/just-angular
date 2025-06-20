import {
  AfterViewChecked,
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
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SeoService } from '../../seo.service';
import { PreviousArticles } from './prev-articles.component';
import { LinkService } from '../../head-link.service';
import { Breadcrumbs } from "../../components/breadcrumb.component";

@Component({
  selector: 'app-blog-post',
  standalone: true,
  template: `
    @if (post$ | async; as post) {
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="w-full hidden md:block">
          <app-breadcrumbs
            [breadcrumbs]="[
              { url: '/blog', label: 'Blog' },
              { url: '/blog/' + post.attributes.slug, label: post.attributes.title }
            ]"
          />
        </div>

        <img
          class="cover-image mt-8"
          style="view-transition-name: {{ post.attributes.slug }}"
          [src]="post.attributes.coverImage"
          [alt]="post.attributes.description"
        />

        <div class="flex items-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Published on {{ post.attributes.publishedAt | date: 'longDate' }}</span>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          @for (tag of post.attributes.tags; track tag) {
            <a [routerLink]="['/blog']" [queryParams]="{ tag }"
               class="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200">
              {{ tag }}
            </a>
          }
        </div>

        <article class="prose prose-lg dark:prose-invert max-w-none mt-8">
          <analog-markdown [content]="post.content" />
        </article>
        
        <hr class="my-8 border-gray-200 dark:border-gray-700" />

        <div class="bg-gray-100 dark:bg-slate-800 p-6 rounded-lg flex items-center justify-between flex-col sm:flex-row gap-6">
          <div class="text-lg font-semibold text-gray-800 dark:text-white text-center sm:text-left">
            Did you find this article helpful? Please share it!
          </div>
          <div class="flex items-center gap-4">
            <a href="https://twitter.com/intent/tweet?text=Just read {{ post.attributes.title }}&url={{postUrl}}&via=Enea_Jahollari"
               target="_blank" rel="noopener" class="social-icon-link">
              <img src="/x.svg" alt="Share on Twitter" class="social-icon" />
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url={{postUrl}}" target="_blank"
               rel="noopener" class="social-icon-link">
              <img src="/linkedin.webp" alt="Share on LinkedIn" class="social-icon" />
            </a>
          </div>
        </div>

        <div class="giscus"></div>

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
    NgStyle,
    RouterLinkActive,
    MarkdownComponent,
    PreviousArticles,
    Breadcrumbs,
  ],
  providers: [LinkService]
})
export default class Blogpost implements OnDestroy, AfterViewChecked {
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
        this.linkService.addTag({ rel: 'canonical', href: post.attributes.canonicalUrl, pageId: post.slug });
      } else {
        this.linkService.removeLinks();
      }
    });
  }

  ngAfterViewChecked() {
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
