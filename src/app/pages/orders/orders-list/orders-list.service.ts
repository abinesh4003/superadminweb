import {Injectable} from '@angular/core';
import {catchError} from "rxjs/operators/catchError";
import {of} from "rxjs/observable/of";
import {ApiService} from "@app/core/services/api.service";
import {Observable, Subject} from "rxjs";
import * as moment from "moment";

@Injectable()
export class OrdersListService {
  private filterObj = new Subject<any>();

  constructor(private api: ApiService) {
  }

  public filterChanged(filterObj) {
    this.filterObj.next(filterObj);
  }

  public onFilterChange(): Observable<any> {
    return this.filterObj.asObservable();
  }

  getInitFiltersData(status) {
    let filter_date = null;
    if (status === 5 || status === 7) {
      const DATE_FORMAT = 'YYYY-MM-DD';
      filter_date = {
        from: moment(new Date()).format(DATE_FORMAT),
        to: moment(new Date()).add(1, "days").format(DATE_FORMAT)
      }
    }
    return {
      category: 'All',
      location: 'All',
      searchtxt: '',
      order_type: 'All',
      filter: 'All',
      filter_date
    };
  }

  getFiltersObj(filtersObj) {
    const {searchtxt, category, location, order_type, filter, store_id, filter_date} = filtersObj;

    return {
      search_key: searchtxt,
      location_name: location,
      category_id: category,
      filter: filter,
      order_type: order_type,
      store_id,
      filter_date
    };
  }

  searchAdsStoreList(keyword) {
    return this.api.searchAdsStoreList({keyword})
      .pipe(
        catchError(() => of([]))
      );
  }
}
