import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromotionAdsService } from '@app/pages/promotion/ads/promotion-ads.service';

@Component({
  templateUrl: 'promotion-ads.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromotionAdsComponent implements OnInit {
  isPageLoaded = true;
  tabs: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: PromotionAdsService
  ) {
  }

  ngOnInit() {
    this.initTabs();
  }

  private initTabs(): void {
    this.tabs = this.service.getTabs(this.activatedRoute);
  }
}
