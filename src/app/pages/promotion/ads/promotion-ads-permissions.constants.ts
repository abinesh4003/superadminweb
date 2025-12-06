import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';

export const PromotionAdsScratchCardPermissionsConstants = {
  PATH: 'promotion.sponsor_ads.scratch_card',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
};

export const PromotionAdsMerchantsPermissionsConstants = {
  PATH: 'promotion.sponsor_ads.merchant_ads',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get create_ad() {
    return `${this.PATH}.create_ad`;
  }
};

export const PromotionAdsPermissionsConstants = {
  ...formatPrivilegesKeys(PromotionAdsScratchCardPermissionsConstants),
  ...formatPrivilegesKeys(PromotionAdsMerchantsPermissionsConstants),
  PATH: ''
};
