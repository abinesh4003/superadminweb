import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromoService } from '@app/pages/promotion/promo-code/promo.service';

@Component({
  selector: 'pkz-promo-code',
  templateUrl: 'promo-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromoCodeComponent implements OnInit {
  isPageLoaded = true;
  tabs: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: PromoService
  ) {}

  ngOnInit() {
    this.initTabs();
  }

  private initTabs(): void {
    this.tabs = this.service.getTabs(this.activatedRoute);
  }
}
