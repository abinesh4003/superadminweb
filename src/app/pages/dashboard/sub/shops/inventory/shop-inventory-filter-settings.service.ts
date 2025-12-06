import { Injectable } from '@angular/core';
import { ShopInventoryService } from '@app/pages/dashboard/sub/shops/inventory/shop-inventory.service';
import { FilterFormService } from '@app/shared/components/filter-form/filter-form.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';

@Injectable()
export class ShopInventoryFilterSettingsService {
  private settings = [{
    type: 'input',
    label: 'Search',
    placeholder: 'Product search',
    name: 'text',
    width: 4
  }, {
    type: 'select',
    label: 'Barcode Type',
    name: 'type',
    options: [],
    width: 3
  }, {
    type: 'select',
    label: 'Category',
    name: 'category',
    options: [],
    width: 3
  }];

  constructor(
    private filterFormService: FilterFormService,
    private shopInventoryService: ShopInventoryService
  ) {}

  getFilterSettings(categoryId) {
    return forkJoin([
      this.getAsyncOptions(categoryId),
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
      type: {
        options: this.shopInventoryService.getBarcodeTypes()
      }
    };
  }

  private getAsyncOptions(categoryId) {
    return this.shopInventoryService.getProductCategoryList(categoryId)
      .pipe(
        map(categories => {
          const formattedItems = categories
            .sort()
            .map((name) => {
              return {
                id: name,
                name
              };
            });

          formattedItems.unshift({id: '', name: 'All'});

          return {
            category: {
              options: formattedItems
            }
          };
        })
      );
  }
}
