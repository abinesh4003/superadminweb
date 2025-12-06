import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PROMOTION_BROADCAST_TAB_BAYFAY, PROMOTION_BROADCAST_TAB_MERCHANTS } from '@app/core/constants';
import { ConstantsService } from '@app/core/services/constants.service';
import { PagesService } from '@app/pages/pages.service';
import {
  PromotionBroadcastBayFayPermissionsConstants,
  PromotionBroadcastMerchantsPermissionsConstants
} from './promotion-broadcast-permissions.constants';

@Injectable()
export class PromotionBroadcastService {
  constructor(
    private pagesService: PagesService,
    private constantsService: ConstantsService
  ) {
  }

  getTabs(route: ActivatedRoute) {
    const url = this.pagesService.getComponentRoute(route);

    const tabsData = this.constantsService
      .getListByKey('promotion_broadcast_tabs')
      .map((tab) => {
        let permissions;

        switch (tab.id) {
          case PROMOTION_BROADCAST_TAB_MERCHANTS:
            permissions = PromotionBroadcastMerchantsPermissionsConstants;
            break;
          case PROMOTION_BROADCAST_TAB_BAYFAY:
            permissions = PromotionBroadcastBayFayPermissionsConstants;
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
    return route.snapshot.parent.routeConfig.path === PROMOTION_BROADCAST_TAB_MERCHANTS;
  }

  isBayFayPage(route: ActivatedRoute) {
    return route.snapshot.parent.routeConfig.path === PROMOTION_BROADCAST_TAB_BAYFAY;
  }

  getTabNameByRoute(route: ActivatedRoute) {
    return this.constantsService.getNameById(route.snapshot.parent.routeConfig.path, 'promotion_broadcast_tabs');
  }
}
