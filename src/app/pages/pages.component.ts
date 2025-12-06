import { ChangeDetectionStrategy, Component, OnInit, Renderer2 } from '@angular/core';
import { PagesService } from '@app/pages/pages.service';

@Component({
  selector: 'pkz-pages',
  templateUrl: './pages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagesComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private pagesService: PagesService
  ) {}

  ngOnInit() {
    this.destroyPreloader();
  }

  private destroyPreloader(): void {
    if (this.pagesService.isBrowser()) {
      const preloader = document.body.querySelector('.preloader');
      if (preloader) {
        this.renderer.removeChild(document.body, preloader);
      }
    }
  }
}
