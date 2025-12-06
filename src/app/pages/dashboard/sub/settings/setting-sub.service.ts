import { Injectable } from '@angular/core';
import { DB_SHOP_TYPE_ALL, DB_SHOP_TYPE_PUBLIC, DB_SHOP_TYPE_PRIVATE, DB_SHOP_TYPE_BRANDED } from '@app/core/constants';
import { ConstantsService } from '@app/core/services/constants.service';
import * as dashboard from '@app/store/actions/dashboard.actions';
import { AppState } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { SettingsSubGeneralPermissionsConstants,
    SettingsSubBasicPermissionsConstants,
    SettingsSubPrivatePermissionsConstants } from './settings-sub-permissions.constants';
import { getSettingsTab } from '@app/store/root-reducer';
import { PagesService } from '@app/pages/pages.service';
import { ApiService } from '@app/core/services/api.service';

@Injectable()
export class SettingSubService {
    constructor(
        private store: Store<AppState>,
        private constantsService: ConstantsService,
        private pagesService: PagesService,
        private api: ApiService
    ) { }

    public getTabItems(type) {
        const tabsIndexesArr = [];
        if (this.pagesService.hasPermissions(SettingsSubGeneralPermissionsConstants.view)) {
            tabsIndexesArr.push(DB_SHOP_TYPE_ALL);
        }
        if (this.pagesService.hasPermissions(SettingsSubBasicPermissionsConstants.view) && (type === 'Public Shops')) {
            tabsIndexesArr.push(DB_SHOP_TYPE_PUBLIC);
        }
        if (this.pagesService.hasPermissions(SettingsSubBasicPermissionsConstants.view) && (type === 'Branded Shops')) {
            tabsIndexesArr.push(DB_SHOP_TYPE_BRANDED);
        }
        if (this.pagesService.hasPermissions(SettingsSubPrivatePermissionsConstants.view)) {
            tabsIndexesArr.push(DB_SHOP_TYPE_PRIVATE);
        }
        if (!tabsIndexesArr.length) {
            return [];
        }
        return this.getTabsArr(tabsIndexesArr);
    }



    getTabsArr(array) {
        return this.constantsService.getListByKey('db_shop_type')
            .filter(item => array.includes(item.id));
    }

    getCategoryCartTypes() {
        return this.api.getCategoryCartTypes();
    }

    getServiceTypes() {
        return this.api.getServiceTypes();
    }

    getCategorySettings(categoryId) {
        return this.api.getCategorySettings(categoryId);
    }

    getCategoryTooltips(categoryId) {
        return this.api.getCategorySettingTooltips(categoryId);
    }

    changeShopsStatusTab(tabId) {
        this.store.dispatch(new dashboard.ChangeSettingsTab(tabId));
    }

    getActiveTabId() {
        return this.store.select(getSettingsTab);
    }

    updateCategorySetting(categoryId, data, type) {
        return this.api.updateCategorySetting(categoryId, data, type);
    }

    isGeneric(tabId) {
        return tabId === DB_SHOP_TYPE_ALL;
    }

    isPublic(tabId) {
        return tabId === DB_SHOP_TYPE_PUBLIC;
    }

    isPrivate(tabId) {
        return tabId === DB_SHOP_TYPE_PRIVATE;
    }

    isBranded(tabId) {
        return tabId === DB_SHOP_TYPE_BRANDED;
    }
}
