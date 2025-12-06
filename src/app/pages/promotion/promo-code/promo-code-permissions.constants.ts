import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';

export const PromotionPromoCodeBayFayPermissionsConstants = {
  PATH: 'promotion.manage_promo.bayfay_code',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get create() {
    return `${this.PATH}.create`;
  },
};

export const PromotionPromoCodeMerchantsPermissionsConstants = {
  PATH: 'promotion.manage_promo.merchant_code',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get create() {
    return `${this.PATH}.create`;
  },
};

export const PromotionPromoCodePermissionsConstants = {
  ...formatPrivilegesKeys(PromotionPromoCodeBayFayPermissionsConstants),
  ...formatPrivilegesKeys(PromotionPromoCodeMerchantsPermissionsConstants),
  PATH: ''
};
