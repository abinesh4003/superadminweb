import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SubscriptionTableFilterService} from '@app/pages/orders/subscription/subscription-table-filter-settings.service';
import {SubscriptionTableService} from '@app/pages/orders/subscription/subscription-table.service';

@Component({
  selector: 'pkz-unsubscriptions',
  templateUrl: './unsubscriptions.component.html',
  styleUrls: ['./unsubscriptions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsubscriptionsComponent implements OnInit {

  isPageLoaded = false;
  filterFormSettings$;
  statusListKey = 'unsubscriptions_status_options';

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
