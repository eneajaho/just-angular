import { DOCUMENT } from '@angular/common';
import {Injectable, Optional, RendererFactory2, ViewEncapsulation, Inject, inject, Renderer2} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LinkService {
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  addTag(tag: LinkDefinition) {
    try {
      const link = this.renderer.createElement('link') as HTMLLinkElement;
      link.id = tag.pageId ? 'ja-' + tag.pageId : '';

      const head = this.document.head;

      if (head === null) return;

      Object.keys(tag).forEach((prop: string) => this.renderer.setAttribute(link, prop, tag[prop]));

      this.removeLinks();

      this.renderer.appendChild(head, link);
    } catch (e) {
      console.error('Error within linkService : ', e);
    }
  }

  removeLinks() {
    const head = this.document.head;
    if (head === null) return;
    const existingLinkTags = this.document.querySelectorAll(`link[id^="ja-"]`);
    existingLinkTags.forEach((tag) => this.renderer.removeChild(head, tag));
  }
}

export declare type LinkDefinition = {
  charset?: string;
  crossorigin?: string;
  href?: string;
  hreflang?: string;
  media?: string;
  rel?: string;
  rev?: string;
  sizes?: string;
  target?: string;
  type?: string;
  pageId?: string;
} & {
  [prop: string]: string;
};
