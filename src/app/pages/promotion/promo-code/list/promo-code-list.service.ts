import { Injectable } from '@angular/core';
import { PROMOTION_PROMO_STATUS_OPEN } from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';
import { map } from 'rxjs/operators/map';

@Injectable()
export class PromoCodeListService {
  constructor(
    private api: ApiService
  ) {
  }

  getPromoCodesList(queryObj) {
    return this.api.getPromoCodesList(queryObj);
  }

  getPromoCodeDropdownValues() {
    return this.api.getPromoCodeDropdownValues()
      .pipe(map(resp => resp.data));
  }

  getInitFiltersData() {
    return {
      status: PROMOTION_PROMO_STATUS_OPEN,
      location: '',
      searchtxt: ''
    };
  }

  getFiltersObj(filtersObj) {
    const {location, status, searchtxt} = filtersObj;

    return {
      location,
      status,
      searchtxt
    };
  }
}
