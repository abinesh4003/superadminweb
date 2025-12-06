import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  PROMOTION_ANNOUNCEMENT_TAB_EMAIL,
  PROMOTION_ANNOUNCEMENT_TAB_PUSH,
  PROMOTION_ANNOUNCEMENT_TAB_SMS
} from '@app/core/constants';
import { ConstantsService } from '@app/core/services/constants.service';
import { PagesService } from '@app/pages/pages.service';
import {
  PromotionAnnouncementEmailPermissionsConstants,
  PromotionAnnouncementPushPermissionsConstants,
  PromotionAnnouncementSMSPermissionsConstants
} from '@app/pages/promotion/announcement/announcement-permissions.constants';

@Injectable()
export class AnnouncementService {
  constructor(
    private pagesService: PagesService,
    private constantsService: ConstantsService
  ) {
  }

  getTabs(route: ActivatedRoute) {
    const url = this.pagesService.getComponentRoute(route);

    const tabsData = this.constantsService
      .getListByKey('promotion_announcement_tabs')
      .map((tab) => {
        let permissions;

        switch (tab.id) {
          case PROMOTION_ANNOUNCEMENT_TAB_SMS:
            permissions = PromotionAnnouncementSMSPermissionsConstants;
            break;
          case PROMOTION_ANNOUNCEMENT_TAB_PUSH:
            permissions = PromotionAnnouncementPushPermissionsConstants;
            break;

          case PROMOTION_ANNOUNCEMENT_TAB_EMAIL:
            permissions = PromotionAnnouncementEmailPermissionsConstants;
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
