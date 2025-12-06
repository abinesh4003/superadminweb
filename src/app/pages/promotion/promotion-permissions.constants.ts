import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';
import { PromotionAdsPermissionsConstants } from '@app/pages/promotion/ads/promotion-ads-permissions.constants';
import { PromotionAnnouncementPermissionsConstants } from '@app/pages/promotion/announcement/announcement-permissions.constants';
import { PromotionBroadcastPermissionsConstants } from '@app/pages/promotion/broadcast/promotion-broadcast-permissions.constants';

export const PromotionPermissionsConstants = {
  ...formatPrivilegesKeys(PromotionBroadcastPermissionsConstants),
  ...formatPrivilegesKeys(PromotionAdsPermissionsConstants),
  ...formatPrivilegesKeys(PromotionAnnouncementPermissionsConstants),
  PATH: '',
};
