import { Injectable } from '@angular/core';
import { PROMOTION_MERCHANTS_ADS_STATUS_LIVE } from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';

@Injectable()
export class MerchantsAdsListService {
  constructor(
    private api: ApiService
  ) {
  }

  getList(queryObj) {
    return this.api.getMerchantsAdsList(queryObj);
  }

  getInitFiltersData() {
    return {
      status: PROMOTION_MERCHANTS_ADS_STATUS_LIVE,
      location_id: ''
    };
  }

  getFiltersObj(filtersObj) {
    const {location_id, status, name} = filtersObj;

    return {
      location_id,
      status,
      name
    };
  }
}
