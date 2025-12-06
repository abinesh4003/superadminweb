import { Injectable } from '@angular/core';
import { ConstantsService } from '@app/core/services/constants.service';
import { PromotionService } from '@app/pages/promotion/promotion.service';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';

@Injectable()
export class MerchantsAdsListFilterSettingsService {
  private settings = [{
    type: 'select',
    label: 'Status',
    name: 'status',
    options: [],
    width: 3
  }, {
    type: 'select',
    label: 'Location',
    name: 'location_id',
    options: [],
    width: 3
  }];

  constructor(
    private constantsService: ConstantsService,
    private filterFormService: FilterFormService,
    private promotionService: PromotionService
  ) {
  }

  getFilterSettings() {
    return forkJoin([
      this.getAsyncOptions(),
      of(this.getOptions()),
    ])
      .pipe(
        map(([asyncOptions, syncOptions]) => {
          const commonOptions = {...asyncOptions, ...syncOptions};

          return this.filterFormService.addOptionsToSettings(this.settings, commonOptions);
        })
      );
  }

  private getOptions() {
    return {
      status: {
        options: this.constantsService.getListByKey('promotion_merchants_ads_status_types')
      }
    };
  }

  private getAsyncOptions() {
    return this.promotionService.getLocationsList()
      .pipe(
        map(locations => {
          return {
            location_id: {
              options: locations
            }
          };
        })
      );
  }
}
