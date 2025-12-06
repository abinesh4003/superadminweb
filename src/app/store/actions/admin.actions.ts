import { Role } from '@app/core/models';
import { Action } from '@ngrx/store';

export enum AdminActionTypes {
  ChangeUsersUserBreadcrumb = '[Admin] Change user breadcrumb',
  ChangeRolesRoleTab = '[Admin] Change roles role tab',
  InitRoles = '[Admin] Init roles',
  ChangeActiveRoleId = '[Admin] Change active role id',
  ChangeActiveUserId = '[Admin] Change active user id',
  ChangeActiveUser = '[Admin] Change active user',
  ChangeUserPageType = '[Admin] Change user page type'
}

export class ChangeUsersUserBreadcrumb implements Action {
  readonly type = AdminActionTypes.ChangeUsersUserBreadcrumb;

  constructor(public readonly payload: string) {}
}

export class ChangeRolesRoleTab implements Action {
  readonly type = AdminActionTypes.ChangeRolesRoleTab;

  constructor(public readonly payload: string) {}
}
export class InitRoles implements Action {
  readonly type = AdminActionTypes.InitRoles;

  constructor(public readonly payload: Role[]) {}
}
export class ChangeActiveRoleId implements Action {
  readonly type = AdminActionTypes.ChangeActiveRoleId;

  constructor(public readonly payload: string) {}
}

export class ChangeActiveUserId implements Action {
  readonly type = AdminActionTypes.ChangeActiveUserId;

  constructor(public readonly payload: string) {}
}
export class ChangeActiveUser implements Action {
  readonly type = AdminActionTypes.ChangeActiveUser;

  constructor(public readonly payload: any) {}
}
export class ChangeUserPageType implements Action {
  readonly type = AdminActionTypes.ChangeUserPageType;

  constructor(public readonly payload: string) {}
}

export type AdminActions = ChangeUsersUserBreadcrumb
  | ChangeRolesRoleTab
  | InitRoles
  | ChangeActiveRoleId
  | ChangeActiveUserId
  | ChangeActiveUser
  | ChangeUserPageType;
