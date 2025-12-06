import { Role } from '@app/core/models';
import { AdminActions, AdminActionTypes } from '@app/store/actions/admin.actions';

export interface State {
  usersUserBreadcrumb: string;
  rolesRoleTab: string;
  roles: Role[];
  activeRoleId: string;
  activeUserId: string;
  activeUser: any;
  userPageType: string;
}

const initialState: State = {
  usersUserBreadcrumb: '',
  rolesRoleTab: '',
  roles: [],
  activeRoleId: '',
  activeUserId: '',
  activeUser: null,
  userPageType: ''
};

export function reducer(state = initialState, action: AdminActions): State {
  const {type, payload} = action;

  switch (type) {
    case AdminActionTypes.ChangeUsersUserBreadcrumb:
      return {
        ...state,
        usersUserBreadcrumb: payload
      };
    case AdminActionTypes.ChangeRolesRoleTab:
      return {
        ...state,
        rolesRoleTab: payload
      };
    case AdminActionTypes.InitRoles:
      return {
        ...state,
        roles: [
          ...payload
        ]
      };
    case AdminActionTypes.ChangeActiveRoleId:
      return {
        ...state,
        activeRoleId: payload
      };
    case AdminActionTypes.ChangeActiveUserId:
      return {
        ...state,
        activeUserId: payload
      };
    case AdminActionTypes.ChangeActiveUser:
      return {
        ...state,
        activeUser: payload
      };
    case AdminActionTypes.ChangeUserPageType:
      return {
        ...state,
        userPageType: payload
      };
    default:
      return state;
  }
}

export const getUsersUserBreadcrumb = (state: State) => state.usersUserBreadcrumb;
export const getRolesRoleTab = (state: State) => state.rolesRoleTab;
export const getRoles = (state: State) => state.roles;
export const getActiveRoleId = (state: State) => state.activeRoleId;
export const getActiveUserId = (state: State) => state.activeUserId;
export const getActiveUser = (state: State) => state.activeUser;
export const getUserPageType = (state: State) => state.userPageType;
