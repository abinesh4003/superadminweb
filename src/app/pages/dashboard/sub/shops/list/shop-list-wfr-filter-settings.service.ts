import { Injectable } from '@angular/core';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { ShopListService } from './shop-list.service';
import { ApiService } from '@app/core/services/api.service';

@Injectable()
export class ShopListWfrFilterSettingsService {
  private settings = [{
    type: 'select',
    label: 'Status',
    name: 'status',
    options: [],
    width: 4
  },
  {
    type: 'select',
    label: 'Location',
    name: 'location',
    options: [],
    width: 4
  },
  {
    type: 'input',
    label: 'Search',
    placeholder: 'Search...',
    name: 'text',
    width: 4
  }];

  constructor(
    private shopListService: ShopListService,
    private filterFormService: FilterFormService,
    private api: ApiService
  ) { }

  getFilterSettings(tabId) {
    return forkJoin([
      this.getAsyncOptions(),
      of(this.getOptions(tabId)),
    ])
      .pipe(
        map(([asyncOptions, syncOptions]) => {
          const commonOptions = {...asyncOptions, ...syncOptions};

          return this.filterFormService.addOptionsToSettings(this.settings, commonOptions);
        })
      );
  }

  private getAsyncOptions() {
    return this.api.getShopsLocationList()
      .pipe(
        map(locations => {
          return {
            location: {
              options: this.getShopsLocationOptions(locations)
            }
          };
        })
      );
  }

  private getOptions(tabId) {
    return {
      status: {
        options: this.shopListService.getStatuses(tabId)
      }
    };
  }

  private getShopsLocationOptions(locations) {
    const formattedLocations = locations.map((id) => {
      return {
        id: id,
        name: id
      };
    });
    formattedLocations.unshift({ id: '', name: 'All' });

    return formattedLocations;
  }
}
