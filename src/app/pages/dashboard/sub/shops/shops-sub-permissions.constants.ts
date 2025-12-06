import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';

export const ShopsSubReview = {
  PATH: 'manage_store.shop.review',
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
  get delete() {
    return `${this.PATH}.delete`;
  },
  get manage() {
    return `${this.PATH}.manage`;
  },
  get configure_columns() {
    return `${this.PATH}.configure_columns`;
  }
};

export const ShopsSubActive = {
  PATH: 'manage_store.shop.live',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get suspend() {
    return `${this.PATH}.suspend`;
  },
  get terminate() {
    return `${this.PATH}.terminate`;
  },
  get configure_columns() {
    return `${this.PATH}.configure_columns`;
  }
};

export const ShopsSubPermissionsConstants = {
  ...formatPrivilegesKeys(ShopsSubReview),
  ...formatPrivilegesKeys(ShopsSubActive),
  PATH: 'manage_store.shop'
};
