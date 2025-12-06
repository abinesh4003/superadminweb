import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '@app/core/services/api.service';
import { map } from 'rxjs/operators/map';

@Injectable()
export class CommonChargesService {
  constructor(
    private api: ApiService,
    private fb: FormBuilder
  ) {}

  getCommonChargesSettings() {
    return this.api.getCommonChargesSettings()
      .pipe(map(resp => this.prepareRespForForm(resp)));
  }

  updateCommonChargesSettings(formData) {
    const preparedData = Object.entries(formData).map(([key, value]) => ({type: key, ...value}));

    return this.api.updateCommonChargesSettings({common_charges: preparedData});
  }

  getPercentValuesArray() {
    return [{
      label: 'Credit Card payment fee (%):',
      type: 'credit_card'
    }, {
      label: 'For Recurring Payments - Credit (%):',
      type: 'recurring'
    }, {
      label: 'For Corporate card fee (%):',
      type: 'corporate_card'
    }, {
      label: 'Debit Card payment fee below 2000 (%):',
      type: 'debit_card_below_2000'
    }, {
      label: 'Debit Card payment fee above 2000 (%):',
      type: 'debit_card_above_2000'
    }, {
      label: 'UPI payment fee below 2000 (%):',
      type: 'upi_below_2000'
    }, {
      label: 'UPI payment fee above 2000 (%):',
      type: 'upi_above_2000'
    }, {
      label: 'Net banking (%):',
      type: 'net_banking'
    }];
  }

  private prepareRespForForm(resp) {
    if (!resp.length) {
      return {};
    }

    return resp.reduce((prev, curr) => {

      const obj = {
        fee: curr.fee,
        id: curr.id
      };

      if ('gst' in curr) {
        obj['gst'] = curr.gst;
      }

      prev[curr.type] = obj;

      return prev;
    }, {});
  }

  getFormConfig() {
    return {
      credit_card: this.fb.group({
        fee: null,
        gst: null,
        id: ''
      }),
      recurring: this.fb.group({
        fee: null,
        gst: null,
        id: ''
      }),
      corporate_card: this.fb.group({
        fee: null,
        gst: null,
        id: ''
      }),
      debit_card_below_2000: this.fb.group({
        fee: null,
        gst: null,
        id: ''
      }),
      debit_card_above_2000: this.fb.group({
        fee: null,
        gst: null,
        id: ''
      }),
      upi_below_2000: this.fb.group({
        fee: null,
        gst: null,
        id: ''
      }),
      upi_above_2000: this.fb.group({
        fee: null,
        gst: null,
        id: ''
      }),
      net_banking: this.fb.group({
        fee: null,
        gst: null,
        id: ''
      }),
      amount_withdrawal_fee: this.fb.group({
        fee: null,
        id: ''
      })
    };
  }
}
