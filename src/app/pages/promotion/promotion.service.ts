import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { SendPreviewModalComponent } from '@app/pages/promotion/send-preview-modal/send-preview-modal.component';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { map } from 'rxjs/operators/map';

@Injectable()
export class PromotionService {
  constructor(
    private api: ApiService,
    private modalService: ModalService
  ) {}

  getLocationsList() {
    return this.api.getFinanceLocationsList()
      .pipe(map(this.getLocationOptions));
  }

  openTestSMSModal(data) {
    return this.modalService.open(SendPreviewModalComponent, {title: 'Test SMS'})
      .pipe(
        mergeMap((phone_num) => {
          data.phone_num = phone_num;
          return this.api.promotionSendTestSMS(data);
        })
      );
  }

  openTestPushModal(data) {
    return this.modalService.open(SendPreviewModalComponent, {title: 'Test Push'})
      .pipe(
        mergeMap((phone_num) => {
          data.phone_num = phone_num;
          return this.api.promotionSendTestPush(data);
        })
      );
  }

  openTestEmailModal(data) {
    return this.modalService.open(SendPreviewModalComponent, {title: 'Test Email'})
      .pipe(
        mergeMap((email) => {
          data.email_id = email;
          return this.api.promotionSendTestEmail(data);
        })
      );
  }

  openAnnouncementEmailModal(data) {
    return this.modalService.open(SendPreviewModalComponent, {title: 'Test Email'})
      .pipe(
        mergeMap((email) => {
          data.email_id = email;
          return this.api.promotionSendPrevEmail(data);
        })
      );
  }

  private getLocationOptions(locations) {
    const formattedLocations = locations.map(({_id, name}) => {
      return {
        id: _id,
        name
      };
    });
    formattedLocations.unshift({ id: '', name: 'All' });

    return formattedLocations;
  }
}
