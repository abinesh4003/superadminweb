import { Injectable } from '@angular/core';

import { ApiService } from '@app/core/services/api.service';
import {catchError} from "rxjs/operators/catchError";
import {of} from "rxjs/observable/of";
import {ReplacementProductModalComponent} from "@app/pages/orders/replacement-product-modal/replacement-product-modal.component";
import {mergeMap} from "rxjs/operators/mergeMap";
import {ModalService} from "@app/shared/components/modal/modal.service";
import {MerchantSettingsModalComponent} from "@app/pages/dashboard/sub/shops/settings/merchant-settings-modal/merchant-settings-modal.component";


@Injectable()
export class ShopSettingsService {

  constructor(
    private api: ApiService,
    private modalService: ModalService
  ) { }

  getDashboardShopsStoreView(categoryId, storeId) {
    return this.api.getDashboardShopsStoreView(categoryId, storeId);
  }

  updateDashboardShopStoreSettings(data) {
    return this.api.updateDashboardShopStoreSettings(data);
  }

  deleteShopIconImage(storeId) {
    return this.api.deleteShopIconImage(storeId);
  }

  resetServiceFee(data) {
    return this.api.resetServiceFee(data);
  }

  searchAgencies(search_key) {
    return this.api.searchAgencies({search_key})
      .pipe(
        catchError(() => of([]))
      );
  };

  openMerchantSettingsModal(store_id, merchant_id) {
    return this.modalService.open(MerchantSettingsModalComponent, {data:  {store_id, merchant_id}})
      .pipe(
      mergeMap(_ => {
        return of(true);
      })
    );
  };
}
