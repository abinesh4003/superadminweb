import { Injectable } from '@angular/core';
import { ConstantsService } from '@app/core/services/constants.service';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';

@Injectable()
export class RemittanceFilterSettingsService {
  private settings = [
    {
      type: 'select',
      label: 'Status',
      name: 'status',
      options: [],
      width: 6
    },
    {
      type: 'input',
      label: 'Search',
      placeholder: 'Search...',
      name: 'search_key',
      width: 4
    }
  ];

  constructor(
    private constantsService: ConstantsService,
    private filterFormService: FilterFormService
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
        options: this.constantsService.getListByKey('finance_remittance_status_types')
      }
    };
  }

  private getAsyncOptions() {
    return of({});
  }
}
