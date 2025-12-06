import { Injectable } from '@angular/core';
import { ConstantsService } from '@app/core/services/constants.service';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';

@Injectable()
export class ScFilterSettingsService {
  private settings = [{
    type: 'select',
    label: 'Status',
    name: 'status',
    options: [],
  }, {
    type: 'select',
    label: 'Shop type',
    name: 'type',
    options: [],
    width: 4
  }, {
    type: 'input',
    label: 'Search',
    placeholder: 'Search...',
    name: 'text',
    width: 5
  }];

  constructor(
    private constantsService: ConstantsService,
    private filterFormService: FilterFormService
  ) {}

  getFilterSettings(typeOptions) {
    return this.filterFormService.addOptionsToSettings(
      this.settings,
      this.getOptions(typeOptions)
    );
  }

  private getOptions(typeOptions) {
    return {
      status: {
        options: this.constantsService.getListByKey('sc_status')
      },
      type: {
        options: typeOptions
      }
    };
  }
}
