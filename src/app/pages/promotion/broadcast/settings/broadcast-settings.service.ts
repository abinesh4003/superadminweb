import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { PromotionService } from '@app/pages/promotion/promotion.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { mergeMap } from 'rxjs/operators/mergeMap';

@Injectable()
export class BroadcastSettingsService {

  constructor(
    private api: ApiService,
    private modalService: ModalService,
    private promotionService: PromotionService
  ) {}

  getRequestView(data) {
    return this.api.viewPromotionRequest(data);
  }

  approveRequestView(data) {
    return this.api.approvePromotionRequest(data);
  }

  rejectRequestView(promoId, requestType) {
    return this.modalService.openReject()
      .pipe(
        mergeMap((reason: string) => {
          const data = {
            _id: promoId,
            reason,
            request_type: requestType
          };
          return  this.api.rejectPromotionRequest(data);
        })
      );
  }

  openTestSMSModal(data) {
    return this.promotionService.openTestSMSModal(data);
  }

  openTestEmailModal(data) {
    return this.promotionService.openTestEmailModal(data);
  }
}
