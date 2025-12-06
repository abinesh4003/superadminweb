export const BillingsPermissionsConstants = {
  PATH: 'billing',
  get view() {
    return `${this.PATH}.view`;
  },
  get invoice() {
    return `${this.PATH}.invoice`;
  }
};
