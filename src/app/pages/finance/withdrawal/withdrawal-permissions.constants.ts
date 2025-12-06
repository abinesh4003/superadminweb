export const WithdrawalPermissionsConstants = {
  PATH: 'finance.withdrawal_request',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
};
