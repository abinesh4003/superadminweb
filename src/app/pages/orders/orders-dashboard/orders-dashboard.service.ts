import {Injectable} from '@angular/core';
import {ApiService} from "@app/core/services/api.service";
import {catchError} from "rxjs/operators/catchError";
import {of} from "rxjs/observable/of";

@Injectable()
export class OrdersDashboardService {

  constructor(private api: ApiService) {
  }

  getOrderStatus(body) {
    return this.api.getOrderStatus(body);
  }

  getCustomerStatus(body) {
    return this.api.getCustomerStatus(body);
  }

  getTopOrderLocations(body) {
    return this.api.getTopOrderLocations(body);
  }

  getGraphData(body) {
    return this.api.getGraphData(body);
  }

  searchAdsStoreList(keyword) {
    return this.api.searchAdsStoreList({keyword})
      .pipe(
        catchError(() => of([]))
      );
  }

  getFiltersObj(filtersObj) {
    const {location, category, searchtxt} = filtersObj;

    return {
      location_name: location,
      category_id:  category,
    };
  }

  getInitFiltersData() {
    return {
      category: 'All',
      location: 'All',
    };
  }
}
