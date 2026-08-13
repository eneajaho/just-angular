import {
  Component,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
  signal,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-reading-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="reading-progress" [style.width.%]="progress()"></div>`,
})
export class ReadingProgress {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  progress = signal(0);

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onScroll() {
    if (!this.isBrowser) return;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    this.progress.set(Math.min(100, Math.max(0, pct)));
  }
}
