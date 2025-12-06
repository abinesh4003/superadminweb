import { Injectable } from '@angular/core';

import { ApiService } from '@app/core/services/api.service';
import { PagesService } from '@app/pages/pages.service';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';

@Injectable()
export class ShopFormApiService {

  constructor(
    private api: ApiService,
    private pagesService: PagesService
  ) {}

  getUsersUserLocation() {
    const id = this.pagesService.getLoggedUserId();

    return this.api.getUsersUserLocation(id);
  }

  getUsersUserLocationFilter(country) {
    if (!country) {
      return of([]);
    }

    const id = this.pagesService.getLoggedUserId();

    return this.api.getUsersUserLocationFilter(id, country);
  }

  getDashboardShopsStoreView(categoryId, storeId) {
    return this.api.getDashboardShopsStoreView(categoryId, storeId);
  }

  getDashboardShopsCategoryTypes() {
    return this.api.getStoreCategoryTypes();
  }

  getShopsCategory(data) {
    return this.api.getStoreCategoryList(data)
      .pipe(map(items => items.docs));
  }

  getDashboardShopDeliveryTypes() {
    return this.api.getDashboardShopDeliveryTypes();
  }

  shopStoreApproved(storeId) {
    return this.api.shopStoreApproved(storeId);
  }

  shopStoreRejected(storeId, data) {
    return this.api.shopStoreRejected(storeId, data);
  }

  updateDashboardShopStore(storeId, data) {
    return this.api.updateDashboardShopStore(storeId, data);
  }

  suspendDashboardShopStore(storeId, data) {
    return this.api.suspendDashboardShopStore(storeId, data);
  }

  terminateDashboardShopStore(storeId, data) {
    return this.api.terminateDashboardShopStore(storeId, data);
  }
}
