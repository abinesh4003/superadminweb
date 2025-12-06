import { Injectable } from '@angular/core';
import { DB_SHOP_TAB_ACTIVE, DB_SHOP_TAB_WAITING_REVIEW } from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';
import { ConstantsService } from '@app/core/services/constants.service';
import * as dashboard from '@app/store/actions/dashboard.actions';
import { AppState } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { ShopsSubActive, ShopsSubReview } from './shops-sub-permissions.constants';
import { getShopStatusTab } from '@app/store/root-reducer';
import { PagesService } from '@app/pages/pages.service';

@Injectable()
export class ShopsSubService {
  constructor(
    private store: Store<AppState>,
    private constantsService: ConstantsService,
    private pagesService: PagesService,
    private api: ApiService
  ) {}

  getTabItems() {
    const tabsIndexesArr = [];
    if (this.pagesService.hasPermissions(ShopsSubReview.PATH)) {
      tabsIndexesArr.push(DB_SHOP_TAB_WAITING_REVIEW);
    }

    if (this.pagesService.hasPermissions(ShopsSubActive.PATH)) {
      tabsIndexesArr.push(DB_SHOP_TAB_ACTIVE);
    }
    if (!tabsIndexesArr.length) {
      return [];
    }

    return this.getTabsArr(tabsIndexesArr);
  }

  getTabsArr(array) {
    return this.constantsService.getListByKey('db_shop_tabs')
      .filter(item => array.includes(item.id));
  }

  getCustomStatusesArr(array) {
    return this.constantsService.getListByKey('db_shop_statuses_all')
      .filter(item => array.includes(item.id));
  }

  changeShopsStatusTab(tabId) {
    this.store.dispatch(new dashboard.ChangeShopsStatusTab(tabId));
  }

  getActiveTabId() {
    return this.store.select(getShopStatusTab);
  }

  getPermissions(tabId) {
    tabId = +tabId;
    return this.getPermissionsForShops(tabId);
  }

  private getPermissionsForShops(tabId) {
    if (this.isWFRTab(tabId)) {
      return ShopsSubReview;
    } else if (this.isActiveTab(tabId)) {
      return ShopsSubActive;
    }
  }

  isActiveTab(tabId) {
    return tabId === DB_SHOP_TAB_ACTIVE;
  }

  isWFRTab(tabId) {
    return tabId === DB_SHOP_TAB_WAITING_REVIEW;
  }

  getStatusName(id): string {
    return this.constantsService.getNameById(id, 'db_shop_tabs');
  }

  getItemData(categoryId, storeId) {
    if (categoryId && storeId) {
      return this.api.getDashboardShopsStoreView(categoryId, storeId);
    }

    return of(null);
  }

  getListOfRadiuses() {
    return Array<number>(50)
      .fill(0)
      .map((elem, index) => index + 1);
  }
}
