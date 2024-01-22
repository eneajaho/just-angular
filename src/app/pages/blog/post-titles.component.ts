import {
  Component,
  ChangeDetectionStrategy,
  signal,
  afterNextRender,
  inject,
  Injector,
  Input,
  ApplicationRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-titles',
  template: `
    <ul>
      @for (articleTitle of articleTitles(); track articleTitle.title) {
      <li
        style="margin-left: 20px; max-width: 250px"
        [style.transform]="
          articleTitle.tagName === 'H3' ? 'translateX(18px)' : 'translateX(0)'
        "
        [style.font-size]="articleTitle.tagName === 'H3' ? '0.9em' : '1em'"
        class="cursor-pointer hover:text-indigo-600 pt-4"
      >
        <a [routerLink]="[]" [fragment]="articleTitle.id" class="text-white">
          {{ articleTitle.innerText }}
        </a>
      </li>
      }
    </ul>
  `,
  standalone: true,
  imports: [RouterLink],
})
export class PostTitles {
  private injector = inject(Injector);
  private appRef = inject(ApplicationRef);

  articleTitles = signal<HTMLElement[]>([]);

  ngOnInit() {
    afterNextRender(
      () => {
        setTimeout(() => {
          const allArticleTitles = document!.querySelectorAll(
            'article h2, article h3'
          );
          console.log(document, allArticleTitles);
          this.articleTitles.set(Array.from(allArticleTitles) as HTMLElement[]);

          this.appRef.tick();
        }, 500);
      },
      { injector: this.injector }
    );
  }
}
