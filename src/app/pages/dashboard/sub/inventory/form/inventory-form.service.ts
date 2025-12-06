import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  INPUT_NUMBER,
  INPUT_SELECT,
  INPUT_TEXT,
  INPUT_TEXTAREA,
  SC_FORMAT_DATE,
  SC_FORMAT_DECIMAL,
  SC_FORMAT_DROPDOWN,
  SC_FORMAT_LIST,
  SC_FORMAT_LONG_TEXT,
  SC_FORMAT_NUMBER,
  SC_FORMAT_TEXT
} from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';
import { validateNotEmptyString } from '@app/validators';
import { map } from 'rxjs/operators/map';

@Injectable()
export class InventoryFormService {

  constructor(
    private api: ApiService
  ) {}

  getAssignToUsers(isUpc, categoryId) {
    return this.api.getDashboardInventoryReviewUsers(isUpc, categoryId);
  }

  getDashboardInventoryProductTemplate(isUpc, categoryId) {
    return this.api.getDashboardInventoryProductTemplate(isUpc, categoryId);
  }

  getDashboardInventoryProductCategories(categoryId) {
    return this.api.getDashboardInventoryProductCategories(categoryId);
  }

  getDashboardInventoryProductKeywords(categoryId) {
    return this.api.getDashboardInventoryProductKeywords(categoryId)
      .pipe(map(items => items.filter(item => !['null', 'undefined', ''].includes(item))));
  }

  changeStatusDashboardInventoryProduct(isUpc, categoryId, productId, added_by, data) {
    return this.api.changeStatusDashboardInventoryProduct(isUpc, categoryId, productId, added_by, data);
  }

  getDashboardInventoryProductView(isUpc, categoryId, productId, status) {
    return this.api.getDashboardInventoryProductView(isUpc, categoryId, productId, status);
  }

  addDashboardInventoryProduct(isUpc, categoryId, data) {
    return this.api.addDashboardInventoryProduct(isUpc, categoryId, data);
  }

  updateDashboardInventoryProduct(isUpc, categoryId, productId, data) {
    return this.api.updateDashboardInventoryProduct(isUpc, categoryId, productId, data);
  }

  deleteInventoryImage(categoryId, productId, key, value) {
    return this.api.deleteInventoryImage(categoryId, productId, key, value);
  }

  getFormConfig(data, isNewProduct, isFormDisabled) {
    const config = {};

    for (const item of data) {
      const validators = item.required
        ? [Validators.compose([Validators.required, validateNotEmptyString])]
        : null;

      let value = item.hasOwnProperty('default') ? item.default : '';

      if (this.isSkuField(item.key_name) && isNewProduct) {
        value = this.getSkuId();
      } else if (item.key_name === 'keywords') {
        value = { value, disabled: isFormDisabled };
      } else if (item.format === SC_FORMAT_NUMBER || item.format === SC_FORMAT_DECIMAL) {
        value = 0;
      }

      config[item.key_name] = [value, validators];
    }

    config['draft_assigned'] = '';
    config['feedback'] = '';
    config['userFeedback'] = '';
    config['review_assigned'] = '';
    config['added_by'] = 'admin';

    return config;
  }

  private getSkuId() {
    const LIMIT = 100000000;
    const randomPrefix = Math.floor(10 + Math.random() * 90);

    const id = Date.now() % LIMIT;
    return +[randomPrefix, id].join('');
  }

  getConfigForTemplate(data) {
    return data.map(({required, key_name, display_name, format}) => {
      return {
        required,
        name: key_name,
        label: display_name,
        type: this.getFormControlType(format),
        format,
        readonly: this.isSkuField(key_name)
      };
    });
  }

  private isSkuField(name) {
    return name === 'sku';
  }

  private getFormControlType(format) {
    switch (format) {
      case SC_FORMAT_TEXT:
      case SC_FORMAT_DATE:
      case SC_FORMAT_LIST:
        return INPUT_TEXT;

      case SC_FORMAT_NUMBER:
      case SC_FORMAT_DECIMAL:
        return INPUT_NUMBER;

      case SC_FORMAT_LONG_TEXT:
        return INPUT_TEXTAREA;

      case SC_FORMAT_DROPDOWN:
        return INPUT_SELECT;

      default:
        return INPUT_TEXT;
    }
  }
}
