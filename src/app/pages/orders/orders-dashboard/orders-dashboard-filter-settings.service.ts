import {Injectable} from '@angular/core';
import {ConstantsService} from "@app/core/services/constants.service";
import {FilterFormService} from "@app/shared/components/filter-form/filter-form.service";
import {forkJoin} from "rxjs/observable/forkJoin";
import {map} from "rxjs/operators/map";
import {ApiService} from "@app/core/services/api.service";

@Injectable()
export class OrdersDashboardFilterSettingsService {
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
    ])
      .pipe(
        map(([asyncOptions, syncOptions]) => {
          const commonOptions = {...asyncOptions, ...syncOptions};
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
