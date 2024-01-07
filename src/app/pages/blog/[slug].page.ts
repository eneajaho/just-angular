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

@Component({
  selector: 'app-blog-post',
  standalone: true,
  template: `
    @if (post$ | async; as post) { @if (isDev && isBrowser) {

    <img class="post__image" [src]="post.attributes.coverImage" />
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
    } @else {
    <article>
      <img class="post__image" [src]="post.attributes.coverImage" />
      <analog-markdown [content]="content()" />
    </article>
    } }
  `,
  styles: [
    `
      :host {
        .post__image {
          max-height: 40vh;
        }

        article {
          padding: 2rem 0;
          max-width: 800px;
          font-size: 20px;
        }

        h1 {
          font-size: 2.4em;
          line-height: 1.1;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        h2 {
          font-size: 1.8em;
          line-height: 1.1;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        h3 {
          font-size: 1.4em;
          line-height: 1.1;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        blockquote {
          font-size: 1em;
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
      }
    `,
  ],
  imports: [AsyncPipe, MarkdownComponent, MarkdownEditorComponent],
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

  previousContent = computedPrevious(this.content);

  loading = signal(false);

  ngOnInit() {
    this.post$.pipe(take(1)).subscribe((post) => {
      this.post.set(post);
      this.content.set(post.content || '');
    });
  }

  hasChanges = signal(false);

  lastUpdate?: ReturnType<typeof setTimeout>;

  updateContent($event: string, markdownRenderer: MarkdownComponent) {
    this.content.set($event);
    this.hasChanges.set(true);

    this.loading.set(true);

    let times = 0;
    let interval = setInterval(() => {
      if (times > 3) {
        clearInterval(interval);
        this.loading.set(false);
      }
      this.cdr.detectChanges();
      times++;
      this.loading.set(false);
    }, 1000);
  }

  updateMarkdownFile() {
    const post = this.post();
    if (post) {
      this.http
        .post(`/api/updateContent`, {
          slug: post.attributes.slug,
          content: this.content(),
        })
        .subscribe((res) => {
          console.log(res);
          this.hasChanges.set(false);
        });
    }
  }
}
