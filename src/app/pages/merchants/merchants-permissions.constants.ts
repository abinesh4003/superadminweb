export const MerchantsPermissionsConstants = {
  PATH: 'merchant',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get approve() {
    return `${this.PATH}.approve`;
  },
  get reject() {
    return `${this.PATH}.reject`;
  },
};
