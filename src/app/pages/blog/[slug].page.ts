import { Component, ViewEncapsulation } from '@angular/core';
import { injectContent, MarkdownComponent } from '@analogjs/content';
import { AsyncPipe } from '@angular/common';

import PostAttributes from '../../post-attributes';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent],
  template: `
    @if (post$ | async; as post) {
    <article>
      <img class="post__image" [src]="post.attributes.coverImage" />
      <analog-markdown [content]="post.content" />
    </article>
    }
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
})
export default class HomeComponent {
  readonly post$ = injectContent<PostAttributes>('slug');
}
