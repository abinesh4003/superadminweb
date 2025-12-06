import { Action } from '@ngrx/store';

export enum SidebarActionTypes {
  Toggle = '[Sidebar] Toggle'
}

export class Toggle implements Action {
  readonly type = SidebarActionTypes.Toggle;
}

export type SidebarActions = Toggle;
