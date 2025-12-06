import { Injectable } from '@angular/core';
import { PROMOTION_BROADCAST_STATUS_REQUEST } from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';

@Injectable()
export class BroadcastListService {
  constructor(
    private api: ApiService
  ) {
  }

  getList(queryObj) {
    return this.api.getPromotionList(queryObj);
  }

  getInitFiltersData() {
    return {
      status: PROMOTION_BROADCAST_STATUS_REQUEST,
      location: ''
    };
  }

  getFiltersObj(filtersObj) {
    const {location, status, name} = filtersObj;

    return {
      location,
      status,
      name
    };
  }
}
