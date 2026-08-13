import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { injectContentFiles } from '@analogjs/content';
import PostAttributes from '../post-attributes';

export const routeMeta: RouteMeta = {
  title: 'JustAngular - justangular.com',
  meta: [
    {
      name: 'description',
      content: `The blog you would like to read if you are a beginner or an expert in Angular. It is a comprehensive resource designed to cater to all levels of proficiency, ensuring a seamless learning experience for newcomers and seasoned developers alike.`,
    },
    { name: 'author', content: 'Enea Jahollari' },
    { property: 'og:title', content: 'justangular.com' },
    {
      property: 'og:description',
      content: `The blog you would like to read if you are a beginner or an expert in Angular. It is a comprehensive resource designed to cater to all levels of proficiency, ensuring a seamless learning experience for newcomers and seasoned developers alike.`,
    },
    { property: 'og:image', content: '/justangular.png' },
    { property: 'twitter:creator', content: '@Enea_Jahollari' },
    { property: 'twitter:image', content: '/justangular.png' },
  ],
};

@Component({
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <!-- ===================== HERO ===================== -->
    <section class="relative overflow-hidden">
      <!-- aurora motion -->
      <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div class="aurora-blob animate-aurora"
             style="top:-8rem;left:-6rem;width:34rem;height:34rem;background:radial-gradient(circle at 30% 30%, rgba(225,29,72,0.55), transparent 60%)"></div>
        <div class="aurora-blob animate-aurora-slow"
             style="top:-4rem;right:-8rem;width:32rem;height:32rem;background:radial-gradient(circle at 60% 40%, rgba(139,92,246,0.5), transparent 60%)"></div>
        <div class="aurora-blob animate-float"
             style="bottom:-10rem;left:30%;width:28rem;height:28rem;background:radial-gradient(circle at 50% 50%, rgba(99,102,241,0.4), transparent 60%)"></div>
      </div>

      <div class="mx-auto max-w-6xl px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div class="mx-auto max-w-3xl text-center">
          <p class="eyebrow animate-fade-in-up">Angular insights &amp; deep dives</p>

          <h1 class="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-ink animate-fade-in-up">
            Modern Angular,
            <span class="gradient-text">demystified.</span>
          </h1>

          <p class="mx-auto mt-7 max-w-2xl text-lg sm:text-xl leading-8 text-muted animate-fade-in-up" style="animation-delay:.06s">
            Signals, change detection, resources, SSR and the sharp edges in between —
            careful, practical writing for beginners and seasoned Angular developers alike.
          </p>

          <div class="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up" style="animation-delay:.12s">
            <a routerLink="/blog" class="btn btn-accent">
              Read the blog
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <a routerLink="/about" class="btn btn-ghost">About the author</a>
          </div>

          <!-- stat strip -->
          <dl class="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 animate-fade-in-up" style="animation-delay:.18s">
            <div>
              <dt class="font-serif text-3xl font-semibold text-ink">{{ postCount }}+</dt>
              <dd class="mt-1 text-xs uppercase tracking-wider text-muted">Articles</dd>
            </div>
            <div class="border-x border-hairline">
              <dt class="font-serif text-3xl font-semibold text-ink">v16–22</dt>
              <dd class="mt-1 text-xs uppercase tracking-wider text-muted">Covered</dd>
            </div>
            <div>
              <dt class="font-serif text-3xl font-semibold text-ink">100%</dt>
              <dd class="mt-1 text-xs uppercase tracking-wider text-muted">Angular</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- ===================== LATEST POSTS ===================== -->
    <section class="mx-auto max-w-6xl px-6 lg:px-8 py-16 sm:py-20">
      <div class="flex items-end justify-between gap-4 mb-10">
        <div>
          <p class="eyebrow">Fresh off the keyboard</p>
          <h2 class="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-ink">Latest articles</h2>
        </div>
        <a routerLink="/blog" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-accent transition-colors">
          View all
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (post of latestPosts; track post.attributes.slug) {
          <a [routerLink]="['/blog', post.attributes.slug]"
             class="group card hover-lift overflow-hidden flex flex-col">
            <div class="relative aspect-[16/9] overflow-hidden bg-paper-soft">
              <img [src]="post.attributes.coverImage" [alt]="post.attributes.description"
                   loading="lazy"
                   class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            </div>
            <div class="p-5 flex flex-col flex-1">
              <div class="flex items-center gap-2 text-xs text-muted">
                <time>{{ post.attributes.publishedAt | date: 'MMM d, y' }}</time>
                @if (post.attributes.tags?.[0]) {
                  <span class="h-1 w-1 rounded-full bg-muted/50"></span>
                  <span>{{ post.attributes.tags?.[0] }}</span>
                }
              </div>
              <h3 class="mt-2 font-serif text-xl font-semibold leading-snug text-ink group-hover:text-accent transition-colors line-clamp-2">
                {{ post.attributes.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-muted line-clamp-2">{{ post.attributes.description }}</p>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- ===================== TOPICS ===================== -->
    <section class="mx-auto max-w-6xl px-6 lg:px-8 py-16 sm:py-20">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <p class="eyebrow">What you'll find here</p>
        <h2 class="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-ink">Everything to master Angular</h2>
        <p class="mt-4 text-muted">From the reactive core to production concerns — the topics this blog goes deep on.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (topic of topics; track topic.title) {
          <div class="card hover-lift p-6">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl"
                 [style.background]="topic.tint">
              <span [innerHTML]="topic.icon" class="text-ink"></span>
            </div>
            <h3 class="mt-4 font-serif text-lg font-semibold text-ink">{{ topic.title }}</h3>
            <p class="mt-1.5 text-sm leading-6 text-muted">{{ topic.desc }}</p>
          </div>
        }
      </div>
    </section>

    <!-- ===================== CTA ===================== -->
    <section class="mx-auto max-w-6xl px-6 lg:px-8 pb-24">
      <div class="relative overflow-hidden rounded-3xl border border-hairline bg-ink px-8 py-14 sm:px-14 text-center">
        <div class="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
          <div class="aurora-blob animate-aurora" style="top:-6rem;left:10%;width:24rem;height:24rem;background:radial-gradient(circle,rgba(225,29,72,0.5),transparent 60%)"></div>
          <div class="aurora-blob animate-aurora-slow" style="bottom:-8rem;right:8%;width:24rem;height:24rem;background:radial-gradient(circle,rgba(139,92,246,0.5),transparent 60%)"></div>
        </div>
        <h2 class="relative font-serif text-3xl sm:text-4xl font-semibold text-paper">Never miss a deep dive</h2>
        <p class="relative mx-auto mt-3 max-w-xl text-paper/70">
          New Angular insights, the moment they ship. Follow along on Twitter/X.
        </p>
        <div class="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="https://twitter.com/Enea_Jahollari" target="_blank" rel="noopener"
             class="btn bg-paper text-ink hover:-translate-y-0.5">Follow on Twitter ↗</a>
          <a routerLink="/blog" class="btn border border-paper/25 text-paper hover:bg-paper/10 hover:-translate-y-0.5">Browse articles</a>
        </div>
      </div>
    </section>
  `,
})
export default class HomePageComponent {
  private readonly allPosts = injectContentFiles<PostAttributes>()
    .filter((a) => new Date() > new Date(a.attributes.publishedAt))
    .sort((a, b) => (a.attributes.publishedAt > b.attributes.publishedAt ? -1 : 1));

  readonly latestPosts = this.allPosts.slice(0, 3);
  readonly postCount = this.allPosts.length;

  readonly topics = [
    {
      title: 'Signals',
      desc: 'How the reactive primitive works, and how to model state with it effectively.',
      tint: 'rgba(225,29,72,0.12)',
      icon: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    },
    {
      title: 'Change Detection',
      desc: 'Zone.js, zoneless, OnPush and the signal-driven future of rendering.',
      tint: 'rgba(139,92,246,0.12)',
      icon: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>',
    },
    {
      title: 'Control Flow',
      desc: 'The @if / @for / @switch syntax and the @defer block for lazy UI.',
      tint: 'rgba(16,185,129,0.14)',
      icon: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
    },
    {
      title: 'HTTP & Resources',
      desc: 'resource(), httpResource, chaining, cancellation and error handling.',
      tint: 'rgba(245,158,11,0.14)',
      icon: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
    },
    {
      title: 'Forms',
      desc: 'Typed forms, validation, two-way binding and typeahead patterns.',
      tint: 'rgba(236,72,153,0.14)',
      icon: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>',
    },
    {
      title: 'SSR & Performance',
      desc: 'Hydration, partial hydration, SEO and fast first loads with Angular.',
      tint: 'rgba(99,102,241,0.14)',
      icon: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z"/><path d="m8 12 3 3 5-6"/></svg>',
    },
  ];
}
