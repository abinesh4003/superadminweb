import { Injectable } from '@angular/core';
import {
  DB_INV_STATUS_DRAFT,
  DB_INV_STATUS_LIVE,
  DB_INV_STATUS_M_DRAFT,
  DB_INV_STATUS_OPEN,
  DB_INV_STATUS_REJECTED,
  DB_INV_STATUS_SUSPENDED,
  DB_INV_STATUS_WAITING_REVIEW
} from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';
import { InventoryService } from '@app/pages/dashboard/sub/inventory/inventory.service';
import { PagesService } from '@app/pages/pages.service';
import { AppState, getSubCategoryId, isUpcInventoryTab } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { zip } from 'rxjs/observable/zip';
import { concatMap } from 'rxjs/operators/concatMap';
import { takeWhile } from 'rxjs/operators/takeWhile';
import { mergeMap } from 'rxjs/operators/mergeMap';

@Injectable()
export class InventoryListService {

  constructor(
    private inventoryService: InventoryService,
    private api: ApiService,
    private pagesService: PagesService,
    private store: Store<AppState>,
  ) {}

  getAssignUsers(tabId, isUpc, id) {
    switch (tabId) {
      case DB_INV_STATUS_DRAFT:
        return this.api.getDashboardInventoryDraftUsers(isUpc, id);
      case DB_INV_STATUS_M_DRAFT:
        return this.api.getDashboardInventoryMDraftUsers(isUpc, id);
      case DB_INV_STATUS_WAITING_REVIEW:
        return this.api.getDashboardInventoryReviewUsers(isUpc, id);
      default:
        return of([]);
    }
  }

  assignProducts(tabId, isUpc, id, data) {
    switch (tabId) {
      case DB_INV_STATUS_DRAFT:
        return this.api.assignDashboardInventoryDraftProducts(isUpc, id, data);
      case DB_INV_STATUS_M_DRAFT:
        return this.api.assignDashboardInventoryMDraftProducts(isUpc, id, data);
      case DB_INV_STATUS_WAITING_REVIEW:
        return this.api.assignDashboardInventoryReviewProducts(isUpc, id, data);
    }
  }

  getDashboardInventoryProductsDownload(selectedProducts) {
    const products = this.getProductsIds(selectedProducts);
    const data = {product_id: products};

    return zip(
      this.store.select(isUpcInventoryTab),
      this.store.select(getSubCategoryId)
    )
      .pipe(
        takeWhile(([isUpc, categoryId]) => !!categoryId),
        concatMap(([isUpc, categoryId]) => {
          return this.api.getDashboardInventoryProductsDownload(isUpc, categoryId, data);
        })
      );
  }

  getProductsIds(selectedProducts) {
    return selectedProducts.map((product) => product._id);
  }

  deleteProductsModal(selectedProducts) {
    const products = this.getProductsIds(selectedProducts);
    const productNames = selectedProducts.map(({product_name}) => product_name).join(', ');
    const data = {status: 7, products};

    return this.pagesService.confirmActionModal(productNames)
      .pipe(mergeMap(() => this.deleteDashboardInventoryProducts(data)));
  }

  private deleteDashboardInventoryProducts(queryObj) {
    return zip(
      this.store.select(isUpcInventoryTab),
      this.store.select(getSubCategoryId)
    )
      .pipe(
        takeWhile(([isUpc, categoryId]) => !!categoryId),
        mergeMap(([isUpc, categoryId]) => {
          return this.api.deleteDashboardInventoryProducts(isUpc, categoryId, queryObj);
        })
      );
  }

  getDashboardInventoryProducts(queryObj) {
    return zip(
      this.store.select(isUpcInventoryTab),
      this.store.select(getSubCategoryId)
    )
      .pipe(
        takeWhile(([isUpc, categoryId]) => !!categoryId),
        mergeMap(([isUpc, categoryId]) => {
          return this.api.getDashboardInventoryProducts(isUpc, categoryId, queryObj);
        })
      );
  }

  getDashboardInventorySampleDownload(isUpc, categoryId) {
    return this.api.getDashboardInventorySampleDownload(isUpc, categoryId);
  }

  makeDashboardInventoryBulkUpload(isUpc, categoryId, formData) {
    return this.api.makeDashboardInventoryBulkUpload(isUpc, categoryId, formData);
  }

  getStatusesForQuery(selectedStatus, tabId) {
    const allowedStatuses = this.getFilterStatuses(tabId);

    if (selectedStatus === DB_INV_STATUS_OPEN) {
      return allowedStatuses.filter(item => item !== DB_INV_STATUS_OPEN);
    } else {
      return [selectedStatus];
    }
  }

  getFormattedColumns(columns) {
    return columns.map(item => {
      return {
        name: item.display_name,
        prop: item.key_name
      };
    });
  }

  getStatuses(tabId) {
    const statusesArr = this.getFilterStatuses(tabId);
    return this.inventoryService.getCustomStatusesArr(statusesArr);
  }

  getAddedBy(isUpc, tabId) {
    if (isUpc && tabId === DB_INV_STATUS_DRAFT) {
      return 'admin';
    } else if (isUpc && tabId === DB_INV_STATUS_M_DRAFT) {
      return 'merchant';
    }

    return '';
  }

  getStatusColumnWidth(tabId) {
    switch (tabId) {
      case DB_INV_STATUS_DRAFT:
      case DB_INV_STATUS_M_DRAFT:
        return 80;

      case DB_INV_STATUS_WAITING_REVIEW:
        return 135;

      case DB_INV_STATUS_LIVE:
        return 95;
    }
  }

  private getFilterStatuses(tabId) {
    switch (tabId) {
      case DB_INV_STATUS_DRAFT:
      case DB_INV_STATUS_M_DRAFT:
        return [DB_INV_STATUS_OPEN, DB_INV_STATUS_DRAFT, DB_INV_STATUS_REJECTED];

      case DB_INV_STATUS_WAITING_REVIEW:
        return [DB_INV_STATUS_OPEN, DB_INV_STATUS_WAITING_REVIEW, DB_INV_STATUS_SUSPENDED];

      case DB_INV_STATUS_LIVE:
        return [DB_INV_STATUS_LIVE, DB_INV_STATUS_SUSPENDED];
    }
  }

}

