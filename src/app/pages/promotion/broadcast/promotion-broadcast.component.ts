import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromotionBroadcastService } from '@app/pages/promotion/broadcast/promotion-broadcast.service';

@Component({
  templateUrl: 'promotion-broadcast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromotionBroadcastComponent implements OnInit {
  isPageLoaded = true;
  tabs: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: PromotionBroadcastService
  ) {
  }

  ngOnInit() {
    this.initTabs();
  }

  private initTabs(): void {
    this.tabs = this.service.getTabs(this.activatedRoute);
  }
}
