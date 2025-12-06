import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';

export const RefundSubPermissionsConstants = {
  PATH: 'manage_store.refund',
  get view() {
    return `${this.PATH}.view`;
  },
};
export const ReplacementSubPermissionsConstants = {
  PATH: 'manage_store.replacement',
  get view() {
    return `${this.PATH}.view`;
  },
};

export const RefundReplacementSubPermissionsConstants = {
  ...formatPrivilegesKeys(RefundSubPermissionsConstants),
  ...formatPrivilegesKeys(ReplacementSubPermissionsConstants),
  PATH: ''
};
