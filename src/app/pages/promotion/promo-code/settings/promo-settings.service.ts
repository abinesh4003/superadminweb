import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';

@Injectable()
export class PromoSettingsService {

  constructor(
    private api: ApiService
  ) {}

  getPromoCodeDetails(data) {
    return this.api.getPromoCodeDetails(data);
  }

  togglePromoCodeActivation(data) {
    return this.api.togglePromoCodeActivation(data);
  }
}
