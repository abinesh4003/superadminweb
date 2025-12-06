import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';

export const PromotionBroadcastBayFayPermissionsConstants = {
  PATH: 'promotion.broadcast.bayfay',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
};

export const PromotionBroadcastMerchantsPermissionsConstants = {
  PATH: 'promotion.broadcast.merchant',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
};

export const PromotionBroadcastPermissionsConstants = {
  ...formatPrivilegesKeys(PromotionBroadcastBayFayPermissionsConstants),
  ...formatPrivilegesKeys(PromotionBroadcastMerchantsPermissionsConstants),
  PATH: ''
};
