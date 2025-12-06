export const RemittancePermissionsConstants = {
  PATH: 'finance.agency_remittance',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
};
