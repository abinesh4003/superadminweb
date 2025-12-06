import { Injectable } from '@angular/core';
import { InventoryListService } from '@app/pages/dashboard/sub/inventory/list/inventory-list.service';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';
import { AppState, getInventoryStatusTab } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators/map';

@Injectable()
export class InventoryListFilterSettingsService {
  private settings = [{
    type: 'select',
    label: 'Status',
    name: 'status',
    options: [],
    width: 4
  }, {
    type: 'input',
    label: 'Search',
    placeholder: 'Search...',
    name: 'text',
    width: 4,
    offset: 2
  }];

  constructor(
    private inventoryListService: InventoryListService,
    private store: Store<AppState>,
    private filterFormService: FilterFormService
  ) {}

  getFilterSettings() {
    return this.store.select(getInventoryStatusTab)
      .pipe(
        map(tabId => {
          return this.filterFormService.addOptionsToSettings(
            this.settings,
            this.getOptions(tabId)
          );
        })
      );
  }

  private getOptions(tabId) {
    return {
      status: {
        options: this.inventoryListService.getStatuses(tabId)
      },
    };
  }
}
