import { SidebarActions, SidebarActionTypes } from '@app/store/actions/sidebar.actions';

export interface State {
  showSidebar: boolean;
}

const initialState: State = {
  showSidebar: true
};

export function reducer (
  state: State = initialState,
  action: SidebarActions
): State {

  switch (action.type) {
    case SidebarActionTypes.Toggle:
      return {
        showSidebar: !state.showSidebar
      };
    default:
      return state;
  }
}

export const getShowSidebar = (state: State) => state.showSidebar;
