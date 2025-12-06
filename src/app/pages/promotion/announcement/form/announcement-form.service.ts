import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  PROMOTION_ANNOUNCEMENT_TAB_EMAIL,
  PROMOTION_ANNOUNCEMENT_TAB_PUSH,
  PROMOTION_ANNOUNCEMENT_TAB_SMS
} from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';
import {
  PromotionAnnouncementEmailPermissionsConstants,
  PromotionAnnouncementPushPermissionsConstants,
  PromotionAnnouncementSMSPermissionsConstants
} from '@app/pages/promotion/announcement/announcement-permissions.constants';
import { PromotionService } from '@app/pages/promotion/promotion.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { of } from 'rxjs/observable/of';
import { concatMap } from 'rxjs/operators/concatMap';

@Injectable()
export class AnnouncementFormService {
  constructor(
    private api: ApiService,
    private promotionService: PromotionService,
    private modalService: ModalService
  ) {
  }

  searchAdsStoreList(keyword) {
    return this.api.searchAdsStoreList({keyword});
  }

  getPromotionAnnouncementCustomerCount(storeId, targetType) {
    const data = {};

    if (storeId) {
      data['store_id'] = storeId;
    }

    if (targetType) {
      data['target_type'] = targetType;
    }
    return this.api.getPromotionAnnouncementCustomerCount(data);
  }

  sendAnnouncementSMS(data) {
    return this.api.sendAnnouncementSMS(data);
  }

  sendAnnouncementPush(data) {
    return this.api.sendAnnouncementPush(data);
  }

  sendAnnouncementEmail(data) {
    return this.api.sendAnnouncementEmail(data);
  }

  openTestSMSModal(data) {
    return this.promotionService.openTestSMSModal(data);
  }

  openTestPushModal(data) {
    return this.promotionService.openTestPushModal(data);
  }

  openAnnouncementEmailModal(data) {
    return this.promotionService.openAnnouncementEmailModal(data);
  }

  testAction(pageType, formData) {
    const {message, pushTitle, option, emailSubject} = formData;
    const data = {};

    switch (pageType) {
      case PROMOTION_ANNOUNCEMENT_TAB_SMS:
        return this.openTestSMSModal({text_message: message.trim()});

      case PROMOTION_ANNOUNCEMENT_TAB_PUSH:
        Object.assign(data, {
          push_title: pushTitle,
          text_message: message.trim()
        });
        return this.openTestPushModal(data);

      case PROMOTION_ANNOUNCEMENT_TAB_EMAIL:
        Object.assign(data, {
          option,
          body: message.trim(),
          subject: emailSubject.trim()
        });
        return this.openAnnouncementEmailModal(data);
    }
  }

  publishAction(pageType, formData) {
    const {message, selectedStore, pushTitle, option, emailSubject, targetType} = formData;
    const data = {};

    if (targetType) {
      Object.assign(data, {target_type: targetType});
    }

    if (selectedStore && targetType !== 2) {
      Object.assign(data, {store_id: selectedStore._id});
    }

    let observable = of(null);

    switch (pageType) {
      case PROMOTION_ANNOUNCEMENT_TAB_SMS:
        Object.assign(data, {
          text_message: message.trim()
        });
        observable = this.sendAnnouncementSMS(data);
        break;

      case PROMOTION_ANNOUNCEMENT_TAB_PUSH:
        Object.assign(data, {
          push_title: pushTitle,
          text_message: message.trim()
        });
        observable = this.sendAnnouncementPush(data);
        break;

      case PROMOTION_ANNOUNCEMENT_TAB_EMAIL:
        Object.assign(data, {
          option,
          body: message.trim(),
          subject: emailSubject.trim()
        });
        observable = this.sendAnnouncementEmail(data);
        break;
    }

    return this.openConfirmPublishModal()
      .pipe(concatMap(() => observable));
  }

  getFormConfig(pageType, allowedMessageLength) {
    const common = {
      selectedStore: null,
      targetType: '',
      message: ['', [Validators.compose([
          Validators.required,
          pageType === PROMOTION_ANNOUNCEMENT_TAB_EMAIL ? null : Validators.maxLength(allowedMessageLength)
        ]
      )]]
    };
    switch (pageType) {
      case PROMOTION_ANNOUNCEMENT_TAB_SMS:
        return common;

      case PROMOTION_ANNOUNCEMENT_TAB_PUSH:
        return Object.assign(common, {
          pushTitle: ['', Validators.required]
        });

      case PROMOTION_ANNOUNCEMENT_TAB_EMAIL:
        return Object.assign(common, {
          emailSubject: ['', Validators.required],
          option: 1
        });
    }
  }

  getPermissions(pageType: string) {
    switch (pageType) {
      case PROMOTION_ANNOUNCEMENT_TAB_SMS:
        return PromotionAnnouncementSMSPermissionsConstants;
      case PROMOTION_ANNOUNCEMENT_TAB_PUSH:
        return PromotionAnnouncementPushPermissionsConstants;
      case PROMOTION_ANNOUNCEMENT_TAB_EMAIL:
        return PromotionAnnouncementEmailPermissionsConstants;
    }
  }

  openConfirmPublishModal() {
    return this.modalService.openConfirm({
      message: 'Are you sure you want to publish this message?',
      options: {
        size: 'sm'
      }
    });
  }
}
