import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ApiService } from '@app/core/services/api.service';

@Injectable()
export class ManageOffersService {
  constructor(
    private api: ApiService
  ) {}

  getManageOfferSettings() {
    return this.api.getManageOffersSettings();
  }

  updateManageOffers(data) {
    const {
      status,
      cashback_type_val: cashback_method_val,
      referer_A: referrer_percent,
      referee_B: referee_percent,
      max_limit: max_limit_value
    } = data;

    return this.api.updateManageOffersSettings({
      status,
      cashback_method_val,
      referrer_percent,
      referee_percent,
      max_limit_value
    });
  }

  getFormConfig() {
    return {
      cashback_type: [],
      cashback_type_val: [null, Validators.required],
      referer_A: [null, [Validators.required, Validators.max(100)]],
      referee_B: [null, [Validators.required, Validators.max(100)]],
      max_limit: [null, Validators.required],
      status: false
    };
  }
}
