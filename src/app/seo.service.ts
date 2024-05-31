import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SeoService {
  title = inject(Title);
  meta = inject(Meta);
  router = inject(Router);

  generateTags({ title = '', description = '', image = '' }) {
    this.title.setTitle(title + ' - justangular.com');
    this.meta.addTags([
      // Open Graph
      { name: 'title', content: title },
      { name: 'author', content: 'Enea Jahollari' },
      { name: 'description', content: description },
      {
        name: 'og:url',
        content: `https://justangular.com${this.router.url}`,
      },
      { name: 'og:title', content: title },
      { name: 'og:description', content: description },
      { name: 'og:image', content: `https://justangular.com${image}` },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@Enea_Jahollari' },
      { name: 'twitter:image:alt', content: title },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:label1', content: 'Written by' },
      { name: 'twitter:data1', content: 'Enea Jahollari'},
      { name: 'twitter:creator', content: '@Enea_Jahollari' },
      { name: 'twitter:image', content: `https://justangular.com${image}` },
      { name: 'twitter:image:src', content: `https://justangular.com${image}` },
    ]);
  }
}
