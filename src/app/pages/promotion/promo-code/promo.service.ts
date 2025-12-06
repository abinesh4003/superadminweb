import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROMOTION_PROMO_TAB_BAYFAY, PROMOTION_PROMO_TAB_MERCHANTS } from '@app/core/constants';
import { ConstantsService } from '@app/core/services/constants.service';
import { PagesService } from '@app/pages/pages.service';
import {
  PromotionPromoCodeBayFayPermissionsConstants,
  PromotionPromoCodeMerchantsPermissionsConstants
} from '@app/pages/promotion/promo-code/promo-code-permissions.constants';

@Injectable()
export class PromoService {
  constructor(
    private pagesService: PagesService,
    private constantsService: ConstantsService
  ) {}

  getTabs(route: ActivatedRoute) {
    const url = this.pagesService.getComponentRoute(route);

    const tabsData = this.constantsService
      .getListByKey('promotion_promo_tabs')
      .map((tab) => {
        let permissions;

        switch (tab.id) {
          case PROMOTION_PROMO_TAB_BAYFAY:
            permissions = PromotionPromoCodeBayFayPermissionsConstants;
            break;
          case PROMOTION_PROMO_TAB_MERCHANTS:
            permissions = PromotionPromoCodeMerchantsPermissionsConstants;
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

  isMerchantsPage(route: ActivatedRoute) {
    return route.snapshot.parent.routeConfig.path === PROMOTION_PROMO_TAB_MERCHANTS;
  }

  isBayFayPage(route: ActivatedRoute) {
    return route.snapshot.parent.routeConfig.path === PROMOTION_PROMO_TAB_BAYFAY;
  }

  getTabNameByRoute(route: ActivatedRoute) {
    return this.constantsService.getNameById(route.snapshot.parent.routeConfig.path, 'promotion_promo_tabs');
  }

  getPermissions(route: ActivatedRoute) {
    return this.isBayFayPage(route) ? PromotionPromoCodeBayFayPermissionsConstants : PromotionPromoCodeMerchantsPermissionsConstants;
  }
}
