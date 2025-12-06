import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {OrdersListFilterSettingsService} from "@app/pages/orders/orders-list/orders-list-filter-settings.service";
import {OrdersListService} from "@app/pages/orders/orders-list/orders-list.service";

@Component({
  selector: 'pkz-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewOrdersComponent implements OnInit {
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
