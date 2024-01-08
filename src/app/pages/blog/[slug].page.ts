import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import {
  ContentFile,
  injectContent,
  MarkdownComponent,
} from '@analogjs/content';
import { AsyncPipe } from '@angular/common';

import { computedPrevious } from 'ngxtension/computed-previous';

import PostAttributes from '../../post-attributes';
import { MarkdownEditorComponent } from './editor.component';
import { take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Breadcrumbs } from '../../components/breadcrumb.component';
import { RouterLink } from '@angular/router';

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

    <div class="w-full grid justify-center">
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
      </article>
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
  styles: [
    `
      :host {
        .cover-image {
          width: 90vw;
          height: fit-content;
          object-fit: cover;
          object-position: center;
          margin-bottom: 2rem;
          border-radius: 10px;
          margin: 0 auto;
          margin-top: 10px;
        }

        article {
          padding: 2rem 0;
          width: 800px;
          font-size: 18px;
          z-index: 2;
        }

        h1 {
          font-size: 2em;
          line-height: 1.1;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        h2 {
          font-size: 1.6em;
          line-height: 1.1;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        h3 {
          font-size: 1.2em;
          line-height: 1.1;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        blockquote {
          font-size: 1.2em;
          font-style: inherit;

          margin-top: 1em;
          margin-bottom: 1em;
          padding-left: 1em;
          border-left: 4px solid #646cff;
        }

        p {
          line-height: 32px;
          margin-top: 2em;
        }

        @media (max-width: 768px) {
          article {
            padding: 1rem 0;
            margin-top: 0;
            width: 90vw;
            margin-top: 0;
            font-size: 16px;
          }

          h1 {
            font-size: 1.5em;
          }

          h2 {
            font-size: 1.2em;
          }

          h3 {
            font-size: 1em;
          }

          blockquote {
            font-size: 1em;
          }
        }
      }
    `,
  ],
  imports: [AsyncPipe, MarkdownComponent, RouterLink, Breadcrumbs],
})
export default class HomeComponent {
  isDev = import.meta.env.MODE === 'development';
  isBrowser = import.meta.env.SSR === false;

  http = inject(HttpClient);

  cdr = inject(ChangeDetectorRef);

  readonly post$ = injectContent<PostAttributes>('slug');

  post = signal<
    ContentFile<PostAttributes | Record<string, never>> | undefined
  >(undefined);

  content = signal<string>('');

  // previousContent = computedPrevious(this.content);

  loading = signal(false);

  ngOnInit() {
    this.post$.pipe(take(1)).subscribe((post) => {
      this.post.set(post);
      this.content.set(post.content || '');
    });
  }

  // hasChanges = signal(false);

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
