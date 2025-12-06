import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ShopInventoryService {
  constructor(
    private api: ApiService
  ) {}

  getShopInventoryList(categoryId, storeId, queryObj) {
    if (categoryId && storeId) {
      return this.api.getShopInventoryList(categoryId, storeId, queryObj);
    }

    return of(null);
  }

  getProductCategoryList(categoryId) {
    return this.api.getProductCategoryList(categoryId);
  }

  getBarcodeTypes() {
    return [{
      id: 0,
      name: 'Open'
    }, {
      id: 'upc',
      name: 'UPC',
    }, {
      id: 'sku',
      name: 'SKU'
    }];
  }
}
