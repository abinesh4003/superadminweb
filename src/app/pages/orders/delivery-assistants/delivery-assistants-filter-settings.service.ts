import {Injectable} from '@angular/core';
import {forkJoin} from "rxjs/observable/forkJoin";
import {of} from "rxjs/observable/of";
import {map} from "rxjs/operators/map";
import {ConstantsService} from "@app/core/services/constants.service";
import {FilterFormService} from "@app/shared/components/filter-form/filter-form.service";
import {ApiService} from "@app/core/services/api.service";
import {Observable, Subject} from "rxjs";

@Injectable()
export class DeliveryAssistantsFilterSettingsService {
  private filterObj = new Subject<any>();

  private settings = [{
    type: 'input',
    label: 'Search:',
    placeholder: 'Assistant name',
    name: 'searchtxt',
    width: 6
  }, {
    type: 'select',
    label: 'Location:',
    name: 'location',
    options: [],
    width: 6
  }, {
    type: 'select',
    label: 'Filter:',
    name: 'filter',
    options: [],
    width: 6
  }];

  constructor(
    private constantsService: ConstantsService,
    private filterFormService: FilterFormService,
    private apiService: ApiService
  ) {
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

  private getFilterValues(isOnline) {
    return isOnline ? {
      filter: {
        options: this.constantsService.getListByKey('online_delivery_assistants_list_filter_values')
      }
    } : {
      filter: {
        options: this.constantsService.getListByKey('delivery_assistants_list_filter_values')
      }
    };
  }

  getFilterSettings(isOnline) {
    return forkJoin([
      this.getLocationsAsync(),
      this.getCategoriesAsync(),
      of(this.getFilterValues(isOnline))
    ])
      .pipe(
        map(([asyncOptions1, asyncOptions2, syncOptions1, syncOptions2]) => {
          const commonOptions = {...asyncOptions1, ...asyncOptions2, ...syncOptions1, ...syncOptions2};
          return this.filterFormService.addOptionsToSettings(this.settings, commonOptions);
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


  public filterChanged(filterObj) {
    this.filterObj.next(filterObj);
  }

  public onFilterChange(): Observable<any> {
    return this.filterObj.asObservable();
  }
}
