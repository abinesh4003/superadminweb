import {Component, OnInit} from '@angular/core';
import {OrdersListFilterSettingsService} from "@app/pages/orders/orders-list/orders-list-filter-settings.service";
import {OrdersListService} from "@app/pages/orders/orders-list/orders-list.service";

@Component({
  selector: 'pkz-packaging-orders',
  templateUrl: './packaging-orders.component.html',
  styleUrls: ['./packaging-orders.component.scss']
})
export class PackagingOrdersComponent implements OnInit {

  isPageLoaded = false;
  filterFormSettings$;

  constructor(private filterSettingsService: OrdersListFilterSettingsService,
              private _orderListService: OrdersListService) {
  }

  ngOnInit() {
    this.initFiltersData();
  }

  private initFiltersData() {
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings();
  }

  onFilter({filtersObj, storeId}) {
    this._orderListService.filterChanged({...filtersObj, store_id: storeId});
  }
}
