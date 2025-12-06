import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageHistoryModalComponent } from '@app/pages/dashboard/sub/shared/message-history-modal/message-history-modal.component';
import { validateCheckboxRequiredInGroupValidator } from '@app/validators/checkbox-required-in-group.validator';
import { ShopImagesReviewModalComponent } from './shop-images-review-modal/shop-images-review-modal.component';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';

@Injectable()
export class ShopFormService {

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder
  ) {
  }

  getShopAvailability() {
    return [
      {id: 'Sun', name: 'Sunday'},
      {id: 'Mon', name: 'Monday'},
      {id: 'Tue', name: 'Tuesday'},
      {id: 'Wed', name: 'Wednesday'},
      {id: 'Thu', name: 'Thursday'},
      {id: 'Fri', name: 'Friday'},
      {id: 'Sat', name: 'Saturday'}
    ];
  }

  openShopImagesReview(images) {
    this.modalService.open(ShopImagesReviewModalComponent, {
      options: {
        windowClass: 'modal-size-700'
      },
      data: images
    });
  }

  openFeedbackHistory(data) {
    return this.modalService.open(MessageHistoryModalComponent, {
      options: {
        windowClass: 'modal-size-700'
      },
      data
    });
  }

  modalAfterFormChanged(message, isFormDirty) {
    if (isFormDirty) {
      return this.modalService.openConfirm({
        message,
        options: {
          size: 'sm'
        }
      });
    }

    return of(null);
  }

  handleMobileNumbersData(data) {
    const defaultObj = {dialing_code: 91, number: 0};
    const primary = data.mobile.primary || defaultObj;
    const secondary = data.mobile.secondary || defaultObj;

    return {primary, secondary};
  }

  getFormConfig(isActiveTab) {
    return {
      storeType: [{value: null, disabled: isActiveTab}],
      storeCategory: [{value: null, disabled: isActiveTab}, Validators.required],
      storeName: [null, Validators.required],
      storeAddress: [null, Validators.required],
      primaryMobileNo: [null, Validators.required],
      secondaryMobileNo: [null],
      primaryMobileDialCode: [{value: null, disabled: true}, Validators.required],
      secondaryMobileDialCode: [{value: null, disabled: true}, Validators.required],
      emailId: [null],
      city: [null, Validators.required],
      state: [null, Validators.required],
      pincode: [null, Validators.required],
      country: [null, Validators.required],
      productReplacement: [null, Validators.required],
      refundWithin: [null, Validators.required],
      deliveryDistance: [null, Validators.required],
      deliveryTimeFrom: [null, Validators.required],
      deliveryTimeTo: [null, Validators.required],
      cashOnDelivery: [null, [Validators.required]],
      deliveryMethod: this.fb.group(
        {},
        {validator: validateCheckboxRequiredInGroupValidator}
      ),
      deliveryCODLimitType: null,
      deliveryCODLimitValue: null,
      deliveryFee: [null, Validators.required],
      feeLimit: [null, Validators.required],
      otherDeliveryIsEnable: false,
      otherCashOnDelivery: false,
      otherDeliveryMethod: this.fb.group({}),
      otherDeliveryFee: null,
      otherFeeLimit: null,
      userFeedback: null,
      feedback: null,
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      availability: this.fb.group({})
    };
  }

  getOtherDeliveryData(data) {
    const {is_enabled, is_cod, fee, fee_limit} = data.delivery.other;

    return {
      otherDeliveryIsEnable: is_enabled,
      otherCashOnDelivery: is_cod,
      otherDeliveryFee: fee,
      otherFeeLimit: fee_limit
    };
  }

  getLocalDeliveryData(data) {
    const {
      radius,
      from,
      to,
      is_cod,
      fee,
      fee_limit,
      is_cod_limit,
      is_cod_limit_type
    } = data.delivery.local;

    return {
      deliveryDistance: radius,
      deliveryTimeFrom: this.getTimeForPicker(from),
      deliveryTimeTo: this.getTimeForPicker(to),
      cashOnDelivery: is_cod,
      deliveryCODLimitValue: is_cod_limit,
      deliveryCODLimitType: is_cod_limit_type,
      deliveryFee: fee,
      feeLimit: fee_limit
    };
  }

  private getTimeForPicker(date: string) {
    let momentDate = moment.utc(date, 'HH:mm:ss', true).local();

    if (!momentDate.isValid()) {
      momentDate = moment(date);
    }

    const hour = momentDate.hour();
    const minute = momentDate.minute();

    return {hour, minute};
  }
}
