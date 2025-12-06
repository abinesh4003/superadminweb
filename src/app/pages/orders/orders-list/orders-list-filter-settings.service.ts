import {Injectable} from '@angular/core';
import {forkJoin} from "rxjs/observable/forkJoin";
import {map} from "rxjs/operators/map";
import {ConstantsService} from "@app/core/services/constants.service";
import {FilterFormService} from "@app/shared/components/filter-form/filter-form.service";
import {ApiService} from "@app/core/services/api.service";
import {of} from "rxjs/observable/of";

@Injectable()
export class OrdersListFilterSettingsService {
  private settings = [{
    type: 'select',
    label: 'Select Category:',
    name: 'category',
    options: [],
    width: 4
  }, {
    type: 'select',
    label: 'Location:',
    name: 'location',
    options: [],
    width: 4
  }, {
    type: 'input',
    label: 'Search:',
    placeholder: 'Order Id, Customer name',
    name: 'searchtxt',
    width: 4
  }, {
    type: 'select',
    label: 'Order Type:',
    name: 'order_type',
    options: [],
    width: 4
  }, {
    type: 'select',
    label: 'Filter:',
    name: 'filter',
    options: [],
    width: 4
  }];

  private settingsType2 = [{
    type: 'select',
    label: 'Select Category:',
    name: 'category',
    options: [],
    width: 3
  }, {
    type: 'select',
    label: 'Location:',
    name: 'location',
    options: [],
    width: 3
  }, {
    type: 'select',
    label: 'Order Type:',
    name: 'order_type',
    options: [],
    width: 3
  }, {
    type: 'input',
    label: 'Search:',
    placeholder: 'Order Id, Customer name',
    name: 'searchtxt',
    width: 3
  }];

  constructor(
    private constantsService: ConstantsService,
    private filterFormService: FilterFormService,
    private apiService: ApiService
  ) {
  }

  getFilterSettings() {
    return forkJoin([
      this.getLocationsAsync(),
      this.getCategoriesAsync(),
      of(this.getOrderTypes()),
      of(this.getFilterValues())
    ])
      .pipe(
        map(([asyncOptions1, asyncOptions2, syncOptions1, syncOptions2]) => {
          const commonOptions = {...asyncOptions1, ...asyncOptions2, ...syncOptions1, ...syncOptions2};
          return this.filterFormService.addOptionsToSettings(this.settings, commonOptions);
        })
      );
  }

  getFilterSettingsType2() {
    return forkJoin([
      this.getLocationsAsync(),
      this.getCategoriesAsync(),
      of(this.getOrderTypes()),
    ])
      .pipe(
        map(([asyncOptions1, asyncOptions2, syncOptions1, syncOptions2]) => {
          const commonOptions = {...asyncOptions1, ...asyncOptions2, ...syncOptions1};
          return this.filterFormService.addOptionsToSettings(this.settingsType2, commonOptions);
        })
      );
  }

  private getCategoriesAsync() {
    return this.apiService.getPublicCategoryList()
      .pipe(
        map(response => {
          return {
            category: {
              options: this.getShopsCategoriesOptions(response.categories)
            }
          };
        })
      );
  }

  private getLocationsAsync() {
    return this.apiService.getShopsLocationList()
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

  private getOrderTypes() {
    return {
      order_type: {
        options: this.constantsService.getListByKey('order_list_types')
      }
    };
  }

  private getFilterValues() {
    return {
      filter: {
        options: this.constantsService.getListByKey('order_list_filter_values')
      }
    };
  }

  private getShopsLocationOptions(options) {
    const formattedOptions = options.map((id) => {
      return {
        id: id,
        name: id
      };
    });
    formattedOptions.unshift({id: 'All', name: 'All'});

    return formattedOptions;
  }

  getShopsCategoriesOptions(categories) {
    const formattedCategories = categories.map(({_id, display_name}) => {
      return {
        id: _id,
        name: display_name
      };
    });
    formattedCategories.unshift({id: 'All', name: 'All'});

    return formattedCategories;
  }

}
