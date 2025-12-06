import { Injectable } from '@angular/core';
import { ConstantsService } from '@app/core/services/constants.service';
import { FinanceService } from '@app/pages/finance/finance.service';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';

@Injectable()
export class WithdrawalFilterSettingsService {
  private settings = [{
    type: 'select',
    label: 'Location',
    name: 'location',
    options: [],
    width: 4
  }, {
    type: 'select',
    label: '',
    name: 'status',
    options: [],
    width: 3
  },  {
    type: 'input',
    label: 'Search',
    placeholder: 'Search...',
    name: 'name',
    width: 3
  }];

  constructor(
    private constantsService: ConstantsService,
    private filterFormService: FilterFormService,
    private financeService: FinanceService
  ) { }

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
        options: this.constantsService.getListByKey('finance_withdrawal_status_types')
      }
    };
  }

  private getAsyncOptions() {
    return this.financeService.getFinanceLocationsList()
      .pipe(
        map(locations => {
          return {
            location: {
              options: locations
            }
          };
        })
      );
  }
}
