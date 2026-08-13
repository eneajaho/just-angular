import {
  Component,
  ChangeDetectionStrategy,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Heading {
  id: string;
  text: string;
  level: number;
}

@Component({
  selector: 'app-toc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (headings().length > 1) {
      <nav class="text-sm">
        <p class="eyebrow mb-3">On this page</p>
        <ul class="border-l border-hairline">
          @for (h of headings(); track h.id) {
            <li>
              <a
                href="#{{ h.id }}"
                (click)="go($event, h.id)"
                class="block border-l-2 -ml-px py-1.5 leading-snug transition-colors"
                [class.pl-4]="h.level === 2"
                [class.pl-7]="h.level === 3"
                [style.borderColor]="active() === h.id ? 'rgb(var(--accent))' : 'transparent'"
                [style.color]="active() === h.id ? 'rgb(var(--ink))' : 'rgb(var(--muted))'"
                [style.fontWeight]="active() === h.id ? '600' : '400'"
              >
                {{ h.text }}
              </a>
            </li>
          }
        </ul>
      </nav>
    }
  `,
})
export class TableOfContents implements OnDestroy {
  private injector = inject(Injector);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  headings = signal<Heading[]>([]);
  active = signal<string>('');

  private observer?: IntersectionObserver;

  constructor() {
    if (!this.isBrowser) return;
    afterNextRender(() => this.collect(0), { injector: this.injector });
  }

  /** Content renders async; retry a few times until headings appear. */
  private collect(attempt: number) {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('article h2, article h3')
    ).filter((el) => !!el.id);

    if (nodes.length === 0 && attempt < 12) {
      setTimeout(() => this.collect(attempt + 1), 250);
      return;
    }

    this.headings.set(
      nodes.map((el) => ({
        id: el.id,
        text: el.innerText,
        level: el.tagName === 'H3' ? 3 : 2,
      }))
    );
    this.observe(nodes);
  }

  private observe(nodes: HTMLElement[]) {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) this.active.set(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    nodes.forEach((n) => this.observer!.observe(n));
    if (nodes[0]) this.active.set(nodes[0].id);
  }

  go(event: Event, id: string) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.active.set(id);
      history.replaceState(null, '', `#${id}`);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
