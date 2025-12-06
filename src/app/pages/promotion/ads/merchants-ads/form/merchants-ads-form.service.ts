import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ApiService } from '@app/core/services/api.service';
import { ConstantsService } from '@app/core/services/constants.service';
import { map } from 'rxjs/operators/map';

@Injectable()
export class MerchantsAdsFormService {

  constructor(
    private api: ApiService,
    private constantsService: ConstantsService
  ) {}

  getFormConfig(isEditPage) {
    return {
      ad_type: [{value: '', disabled: isEditPage}, Validators.required],
      selectedStore: [{value: null, disabled: false}, isEditPage ? null : Validators.required],
      paid_cost: [null, Validators.required],
      expiry_date: [null, Validators.required]
    };
  }

  getAdTypes() {
    return this.constantsService.getListByKey('promotion_merchants_ads_types');
  }

  searchAdsStoreList(keyword) {
    return this.api.searchAdsStoreList({keyword});
  }

  updateMerchantsAdsUpdateText(data) {
    return this.api.updateMerchantsAdsUpdateText(data);
  }

  updateMerchantsAdsUpdateBanner(data) {
    return this.api.updateMerchantsAdsUpdateBanner(data);
  }

  viewMerchantsAds(id) {
    return this.api.viewMerchantsAds(id)
      .pipe(map((resp: any) => resp.data));
  }

  deactivateMerchantsAds(data) {
    return this.api.deactivateMerchantsAds(data);
  }
}
