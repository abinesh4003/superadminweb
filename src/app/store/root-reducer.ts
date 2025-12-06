import { environment } from '@env/environment';
import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromSidebar from './reducers/sidebar.reducer';
import * as fromDashboard from './reducers/dashboard.reducer';
import * as fromAdmin from './reducers/admin.reducer';

export interface AppState {
  sidebar: fromSidebar.State;
  dashboard: fromDashboard.State;
  admin: fromAdmin.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  sidebar: fromSidebar.reducer,
  dashboard: fromDashboard.reducer,
  admin: fromAdmin.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [ storeFreeze ]
  : [];


/**
 * Sidebar Reducer
 */
export const getSidebarState = createFeatureSelector<fromSidebar.State>('sidebar');

export const getShowSidebar = createSelector(
  getSidebarState,
  fromSidebar.getShowSidebar
);

/**
 * Dashboard Reducer
 */
export const getDashboardState = createFeatureSelector<fromDashboard.State>('dashboard');

export const getSubCategoryId = createSelector(
  getDashboardState,
  fromDashboard.getSubCategoryId
);
export const getInventoryStatusTab = createSelector(
  getDashboardState,
  fromDashboard.getInventoryStatusTab
);
export const getInventoryTab = createSelector(
  getDashboardState,
  fromDashboard.getInventoryTab
);
export const isUpcInventoryTab = createSelector(
  getInventoryTab,
  (tab) => tab === 'upc'
);
export const getShopStatusTab = createSelector(
  getDashboardState,
  fromDashboard.getShopStatusTab
);
export const getSettingsTab = createSelector(
  getDashboardState,
  fromDashboard.getSettingsTab
);

/**
 * Admin Reducer
 */
export const getAdminState = createFeatureSelector<fromAdmin.State>('admin');

export const getUsersUserBreadcrumb = createSelector(
  getAdminState,
  fromAdmin.getUsersUserBreadcrumb
);
export const getRolesRoleTab = createSelector(
  getAdminState,
  fromAdmin.getRolesRoleTab
);
export const getRoles = createSelector(
  getAdminState,
  fromAdmin.getRoles
);
export const getActiveRoleId = createSelector(
  getAdminState,
  fromAdmin.getActiveRoleId
);
export const getActiveRole = createSelector(
  getRoles,
  getActiveRoleId,
  (roles, id) => {
    return {...roles.find(role => role._id === id)};
  }
);
export const getActiveUserId = createSelector(
  getAdminState,
  fromAdmin.getActiveUserId
);
export const getActiveUser = createSelector(
  getAdminState,
  fromAdmin.getActiveUser
);
export const getUserPageType = createSelector(
  getAdminState,
  fromAdmin.getUserPageType
);
