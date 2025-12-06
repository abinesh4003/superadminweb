import {Injectable} from '@angular/core';
import {of} from "rxjs/observable/of";
import {FilterFormService} from "@app/shared/components/filter-form/filter-form.service";

@Injectable()
export class SubsProductsFilterSettingsService {
  private settings = [{
    type: 'input',
    label: 'Search:',
    placeholder: 'UPC/EAN/SKU,Product name',
    name: 'searchtxt',
    width: 4
  }];

  constructor(private filterFormService: FilterFormService) {
  }

  getFilterSettings() {
    return of(this.filterFormService.addOptionsToSettings(this.settings, null));
  }

  getInitFiltersData() {
    return {
      searchtxt: ''
    }
  }
}
