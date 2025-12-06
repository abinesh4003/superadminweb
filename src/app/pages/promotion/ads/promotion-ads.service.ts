import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROMOTION_ADS_TAB_MERCHANTS_ADS, PROMOTION_ADS_TAB_SCRATCH_CARD } from '@app/core/constants';
import { ConstantsService } from '@app/core/services/constants.service';
import { PagesService } from '@app/pages/pages.service';
import {
  PromotionAdsMerchantsPermissionsConstants,
  PromotionAdsScratchCardPermissionsConstants
} from '@app/pages/promotion/ads/promotion-ads-permissions.constants';

@Injectable()
export class PromotionAdsService {
  constructor(
    private pagesService: PagesService,
    private constantsService: ConstantsService
  ) {
  }

  getTabs(route: ActivatedRoute) {
    const url = this.pagesService.getComponentRoute(route);

    const tabsData = this.constantsService
      .getListByKey('promotion_ads_tabs')
      .map((tab) => {
        let permissions;

        switch (tab.id) {
          case PROMOTION_ADS_TAB_SCRATCH_CARD:
            permissions = PromotionAdsScratchCardPermissionsConstants;
            break;
          case PROMOTION_ADS_TAB_MERCHANTS_ADS:
            permissions = PromotionAdsMerchantsPermissionsConstants;
            break;
        }

        return {
          title: tab.name,
          route: tab.id,
          skip: !this.pagesService.hasPermissions(permissions.PATH)
        };
      })
      .filter(item => !item.skip);

    return this.pagesService.getRoutedTabsData(tabsData, url);
  }
}
