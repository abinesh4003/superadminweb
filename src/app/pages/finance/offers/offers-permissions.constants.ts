export const FinanceManageOffersPermissionsConstants = {
  PATH: 'finance.manage_offers',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
};
