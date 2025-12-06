import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';

export const PromotionAnnouncementSMSPermissionsConstants = {
  PATH: 'promotion.announcement.sms',
  get read() {
    return `${this.PATH}.read`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
};

export const PromotionAnnouncementPushPermissionsConstants = {
  PATH: 'promotion.announcement.push',
  get read() {
    return `${this.PATH}.read`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
};

export const PromotionAnnouncementEmailPermissionsConstants = {
  PATH: 'promotion.announcement.email',
  get read() {
    return `${this.PATH}.read`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
};

export const PromotionAnnouncementPermissionsConstants = {
  ...formatPrivilegesKeys(PromotionAnnouncementSMSPermissionsConstants),
  ...formatPrivilegesKeys(PromotionAnnouncementPushPermissionsConstants),
  ...formatPrivilegesKeys(PromotionAnnouncementEmailPermissionsConstants),
  PATH: ''
};
