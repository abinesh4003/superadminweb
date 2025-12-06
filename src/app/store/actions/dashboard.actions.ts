import { Action } from '@ngrx/store';

export enum DashboardActionTypes {
  ChangeSubCategoryId = '[Dashboard] change sub category id',
  ResetSubCategoryId = '[Dashboard] reset sub category id',
  ChangeInventoryStatusTab = '[Dashboard] change inventory status tab',
  ChangeInventoryTab = '[Dashboard] change inventory tab',
  ChangeShopsStatusTab = '[Dashboard] change shops status tab',
  ChangeSettingsTab = '[Dashboard] change settings tab'
}

export class ChangeSubCategoryId implements Action {
  readonly type = DashboardActionTypes.ChangeSubCategoryId;

  constructor(public readonly payload: string) {}
}

export class ResetSubCategoryId implements Action {
  readonly type = DashboardActionTypes.ResetSubCategoryId;
}

export class ChangeInventoryStatusTab implements Action {
  readonly type = DashboardActionTypes.ChangeInventoryStatusTab;

  constructor(public readonly payload: number) {
  }
}

export class ChangeInventoryTab implements Action {
  readonly type = DashboardActionTypes.ChangeInventoryTab;

  constructor(public readonly payload: string) {}
}

export class ChangeShopsStatusTab implements Action {
  readonly type = DashboardActionTypes.ChangeShopsStatusTab;

  constructor(public readonly payload: number) {
  }
}
export class ChangeSettingsTab implements Action {
  readonly type = DashboardActionTypes.ChangeSettingsTab;

  constructor(public readonly payload: number) {
  }
}

export type DashboardActions = ChangeSubCategoryId
  | ResetSubCategoryId
  | ChangeInventoryStatusTab
  | ChangeInventoryTab
  | ChangeShopsStatusTab
  | ChangeSettingsTab;
