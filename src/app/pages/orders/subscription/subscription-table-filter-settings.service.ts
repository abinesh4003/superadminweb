import {Injectable} from '@angular/core';
import {forkJoin} from "rxjs/observable/forkJoin";
import {map} from "rxjs/operators/map";
import {ConstantsService} from "@app/core/services/constants.service";
import {FilterFormService} from "@app/shared/components/filter-form/filter-form.service";
import {ApiService} from "@app/core/services/api.service";
import {of} from "rxjs/observable/of";

@Injectable()
export class SubscriptionTableFilterService {
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
    placeholder: 'Subscription id, Customer name, Phone number',
    name: 'searchtxt',
    width: 4
  }, {
    type: 'select',
    label: 'Type:',
    name: 'subscription_type',
    options: [],
    width: 4
  }, {
    type: 'select',
    label: 'Status:',
    name: 'status',
    options: [],
    width: 4
  }];

  constructor(
    private constantsService: ConstantsService,
    private filterFormService: FilterFormService,
    private apiService: ApiService
  ) {
  }

  getFilterSettings(statusListKey) {
    return forkJoin([
      this.getLocationsAsync(),
      this.getCategoriesAsync(),
      this.getSubscriptionsTypesAsync(),
      of(this.getFilterValues()),
      of(this.getSubscriptionsStatusOptions(statusListKey))
    ])
      .pipe(
        map(([asyncOptions1, asyncOptions2, asyncOptions3,  syncOptions1, syncOptions2]) => {
          const commonOptions = {...asyncOptions1, ...asyncOptions2, ...asyncOptions3, ...syncOptions1, ...syncOptions2};
          return this.filterFormService.addOptionsToSettings(this.settings, commonOptions);
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

  private getSubscriptionsTypesAsync() {
    return this.apiService.getSubscriptionList()
        .pipe(
            map(response => {
              return {
                subscription_type: {
                  options: this.getSubscriptionsTypesOptions(response.data)
                }
              };
            })
        );
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

  getSubscriptionsTypesOptions(options) {
    const formattedOptions = options.map(({_id, display_name, index}) => {
      return {
        id: _id,
        name: display_name
      };
    });
    formattedOptions.unshift({id: 'All', name: 'All'});

    return formattedOptions;
  }

  private getSubscriptionsStatusOptions(statusListKey) {
    return {
      status: {
        options: this.constantsService.getListByKey(statusListKey)
      }
    };
  }
}
