import { Injectable } from '@angular/core';
import {
  DB_INV_STATUS_DRAFT,
  DB_INV_STATUS_LIVE,
  DB_INV_STATUS_M_DRAFT,
  DB_INV_STATUS_WAITING_REVIEW
} from '@app/core/constants';
import { ConstantsService } from '@app/core/services/constants.service';
import {
  InventorySkuLive,
  InventorySkuMDraft,
  InventorySkuReview,
  InventoryUpcDraft,
  InventoryUpcLive,
  InventoryUpcMDraft,
  InventoryUpcReview,
} from '@app/pages/dashboard/sub/inventory/inventory-sub-permissions.constants';
import * as dashboard from '@app/store/actions/dashboard.actions';
import { AppState, getInventoryStatusTab, isUpcInventoryTab } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators/map';
import { PagesService } from '@app/pages/pages.service';

@Injectable()
export class InventoryService {
  constructor(
    private store: Store<AppState>,
    private constantsService: ConstantsService,
    private pagesService: PagesService
  ) {}

  getActiveTabId() {
    return this.store.select(getInventoryStatusTab);
  }

  changeInventoryStatusTab(tabId) {
    this.store.dispatch(new dashboard.ChangeInventoryStatusTab(tabId));
  }

  changeInventoryTab(data) {
    if (data && data.inventory) {
      this.store.dispatch(new dashboard.ChangeInventoryTab(data.inventory));
    }
  }

  getTabItems() {
    return this.store.select(isUpcInventoryTab)
      .pipe(
        map(isUpcTab  => {
          const tabsIndexesArr = [];

          if (isUpcTab) {
            if (this.pagesService.hasPermissions(InventoryUpcDraft.PATH)) {
              tabsIndexesArr.push(DB_INV_STATUS_DRAFT);
            }

            if (this.pagesService.hasPermissions(InventoryUpcMDraft.PATH)) {
              tabsIndexesArr.push(DB_INV_STATUS_M_DRAFT);
            }

            if (this.pagesService.hasPermissions(InventoryUpcReview.PATH)) {
              tabsIndexesArr.push(DB_INV_STATUS_WAITING_REVIEW);
            }

            if (this.pagesService.hasPermissions(InventoryUpcLive.PATH)) {
              tabsIndexesArr.push(DB_INV_STATUS_LIVE);
            }
          } else {
            if (this.pagesService.hasPermissions(InventorySkuMDraft.PATH)) {
              tabsIndexesArr.push(DB_INV_STATUS_M_DRAFT);
            }

            if (this.pagesService.hasPermissions(InventorySkuReview.PATH)) {
              tabsIndexesArr.push(DB_INV_STATUS_WAITING_REVIEW);
            }

            if (this.pagesService.hasPermissions(InventorySkuLive.PATH)) {
              tabsIndexesArr.push(DB_INV_STATUS_LIVE);
            }
          }

          return this.getCustomStatusesArr(tabsIndexesArr);
        })
      );
  }

  getStatusByTab(tabId) {
    return tabId === DB_INV_STATUS_M_DRAFT ? DB_INV_STATUS_DRAFT : tabId;
  }

  getCustomStatusesArr(arr) {
    return this.constantsService.getListByKey('db_inv_statuses_all')
      .filter(item => arr.includes(item.id));
  }

  getStatusName(id): string {
    return this.constantsService.getNameById(id, 'db_inv_statuses_all');
  }

  isDraftTab(tabId) {
    return tabId === DB_INV_STATUS_DRAFT;
  }

  isMDraftTab(tabId) {
    return tabId === DB_INV_STATUS_M_DRAFT;
  }

  isWFRTab(tabId) {
    return tabId === DB_INV_STATUS_WAITING_REVIEW;
  }

  isLiveTab(tabId) {
    return tabId === DB_INV_STATUS_LIVE;
  }

  getPermissions(isUpc, tabId) {
    tabId = +tabId;

    if (isUpc) {
      return this.getPermissionsForUpc(tabId);
    }

    return this.getPermissionsForSku(tabId);
  }

  private getPermissionsForUpc(tabId) {
    switch (tabId) {
      case DB_INV_STATUS_DRAFT:
        return InventoryUpcDraft;
      case DB_INV_STATUS_M_DRAFT:
        return InventoryUpcMDraft;
      case DB_INV_STATUS_WAITING_REVIEW:
        return InventoryUpcReview;
      case DB_INV_STATUS_LIVE:
        return InventoryUpcLive;
    }
  }

  private getPermissionsForSku(tabId) {
    switch (tabId) {
      case DB_INV_STATUS_M_DRAFT:
        return InventorySkuMDraft;
      case DB_INV_STATUS_WAITING_REVIEW:
        return InventorySkuReview;
      case DB_INV_STATUS_LIVE:
        return InventorySkuLive;
    }
  }

}
