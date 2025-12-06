import { DashboardActions, DashboardActionTypes } from '../actions/dashboard.actions';
import {
  DB_INV_STATUS_DRAFT, DB_SHOP_TAB_WAITING_REVIEW
} from '@app/core/constants';

const UPC_INVENTORY_TAB = 'upc';

export interface State {
  subCategoryId: string | null;
  inventoryStatusTab: number;
  inventoryTab: string;
  shopsStatusTab: number;
  settingsTab: number;
}

const initialState: State = {
  subCategoryId: null,
  inventoryStatusTab: DB_INV_STATUS_DRAFT,
  inventoryTab: UPC_INVENTORY_TAB,
  shopsStatusTab: DB_SHOP_TAB_WAITING_REVIEW,
  settingsTab: null
};

export function reducer(
  state: State = initialState,
  action: DashboardActions
): State {
  switch (action.type) {
    case DashboardActionTypes.ChangeSubCategoryId:
      return {
        ...state,
        subCategoryId: action.payload
      };
    case DashboardActionTypes.ResetSubCategoryId:
      return {
        ...state,
        subCategoryId: null
      };
    case DashboardActionTypes.ChangeInventoryStatusTab:
      return {
        ...state,
        inventoryStatusTab: action.payload
      };
    case DashboardActionTypes.ChangeInventoryTab:
      return {
        ...state,
        inventoryTab: action.payload
      };
    case DashboardActionTypes.ChangeShopsStatusTab:
      return {
        ...state,
        shopsStatusTab: action.payload
      };
    case DashboardActionTypes.ChangeSettingsTab:
      return {
        ...state,
        settingsTab: action.payload
      };
    default:
      return state;
  }
}

export const getSubCategoryId = (state: State) => state.subCategoryId;
export const getInventoryStatusTab = (state: State) => state.inventoryStatusTab;
export const getInventoryTab = (state: State) => state.inventoryTab;
export const getShopStatusTab = (state: State) => state.shopsStatusTab;
export const getSettingsTab = (state: State) => state.settingsTab;
