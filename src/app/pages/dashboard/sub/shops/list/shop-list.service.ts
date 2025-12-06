import { Injectable } from '@angular/core';
import {
  DB_SHOP_STATUS_LIVE,
  DB_SHOP_STATUS_OPEN,
  DB_SHOP_STATUS_SUBMITTED,
  DB_SHOP_STATUS_SUSPENDED,
  DB_SHOP_TAB_ACTIVE,
  DB_SHOP_TAB_WAITING_REVIEW,
} from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';
import { PagesService } from '@app/pages/pages.service';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { ShopsSubService } from '../shops-sub.service';

@Injectable()
export class ShopListService {

  constructor(
    private shopsSubService: ShopsSubService,
    private api: ApiService,
    private pagesService: PagesService,
  ) { }

  getFormattedColumns(data) {
    // TODO: add implementation
    return [];
  }

  getStatuses(tabId) {
    const statusesArr = this.getFilterStatuses(tabId);
    return this.shopsSubService.getCustomStatusesArr(statusesArr);
  }

  private getFilterStatuses(tabId) {
    switch (tabId) {
      case DB_SHOP_TAB_WAITING_REVIEW:
        return [DB_SHOP_STATUS_OPEN, DB_SHOP_STATUS_SUBMITTED, DB_SHOP_STATUS_SUSPENDED];

      case DB_SHOP_TAB_ACTIVE:
        return [DB_SHOP_STATUS_LIVE, DB_SHOP_STATUS_SUSPENDED];
    }
  }

  getStatusesForQuery(selectedStatus, tabId) {
    const allowedStatuses = this.getFilterStatuses(tabId);
    if (selectedStatus === DB_SHOP_STATUS_OPEN) {
      return allowedStatuses.filter(item => item !== DB_SHOP_STATUS_OPEN);
    } else {
        return [selectedStatus];
      }
  }

  getDashboardShopsStores(categoryId, queryObj, tabId) {
    if (tabId === DB_SHOP_TAB_WAITING_REVIEW) {
      return this.api.getDashboardShopsStores(categoryId, queryObj);
    } else if (tabId === DB_SHOP_TAB_ACTIVE) {
      return this.api.getDashboardShopsActiveStores(categoryId, queryObj);
    }
  }

  getAssignUsers(categoryId) {
    return this.api.getDashboardShopsReviewUsers(categoryId);
  }

  assignStores(id, data) {
    return this.api.assignDashboardShopsReview(id, data);
  }

  deleteStoresModal(selectedStores) {
    const storeIds = selectedStores.map(({ _id }) => _id);
    const storeNames = selectedStores.map(({ display_name }) => display_name);
    const data = { stores: storeIds };
    return this.pagesService.confirmActionModal(storeNames.join(', '))
      .pipe(mergeMap(() => this.deleteDashboardShopsStores(data)));
  }

  viewLocation(coordinates: number[]) {

    if (this.pagesService.isBrowser()) {
      const url = `https://www.google.com/maps/?q=${coordinates}`;

      window.open(url, '_blank');
    }
  }

  private deleteDashboardShopsStores(queryObj) {
    return this.api.deleteDashboardShopsStores(queryObj);
  }

}
