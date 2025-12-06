import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { PromotionAdsPermissionsConstants } from '@app/pages/promotion/ads/promotion-ads-permissions.constants';
import { PromotionAnnouncementPermissionsConstants } from '@app/pages/promotion/announcement/announcement-permissions.constants';
import { PromotionBroadcastPermissionsConstants } from '@app/pages/promotion/broadcast/promotion-broadcast-permissions.constants';
import { PromotionPromoCodePermissionsConstants } from '@app/pages/promotion/promo-code/promo-code-permissions.constants';

@Component({
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromotionComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  get broadcastPermissions(): string[] {
    return privilegesToArray(PromotionBroadcastPermissionsConstants);
  }

  get adsPermissions(): string[] {
    return privilegesToArray(PromotionAdsPermissionsConstants);
  }

  get announcementPermissions(): string[] {
    return privilegesToArray(PromotionAnnouncementPermissionsConstants);
  }

  get promoCodePermissions() {
    return privilegesToArray(PromotionPromoCodePermissionsConstants);
  }
}
