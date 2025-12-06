export const OrdersSubPermissionsConstants = {
  PATH: 'manage_store.order',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get delete() {
    return `${this.PATH}.delete`;
  }
};
