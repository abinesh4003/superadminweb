import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {OrdersListFilterSettingsService} from '@app/pages/orders/orders-list/orders-list-filter-settings.service';
import {OrdersListService} from '@app/pages/orders/orders-list/orders-list.service';
import {SubscriptionTableService} from '@app/pages/orders/subscription/subscription-table.service';
import {SubscriptionTableFilterService} from '@app/pages/orders/subscription/subscription-table-filter-settings.service';

@Component({
  selector: 'pkz-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionsComponent implements OnInit {
  isPageLoaded = false;
  filterFormSettings$;
  statusListKey = 'subscriptions_status_options';

  constructor(private filterSettingsService: SubscriptionTableFilterService,
              private _SubscriptionTableService: SubscriptionTableService) {
  }

  ngOnInit() {
    this.initFiltersData();
  }

  private initFiltersData() {
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings(this.statusListKey);
  }

  onFilter({filtersObj, storeId}) {
    this._SubscriptionTableService.filterChanged({...filtersObj, store_id: storeId});
  }

}
