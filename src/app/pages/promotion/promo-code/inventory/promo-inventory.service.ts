import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ApiService } from '@app/core/services/api.service';
import { PromotionService } from '@app/pages/promotion/promotion.service';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

@Injectable()
export class PromoInventoryService {
  constructor(
    private api: ApiService,
    private promotionService: PromotionService
  ) {
  }

  getLocationsList() {
    return this.promotionService.getLocationsList()
      .pipe(
        map(resp => {
          resp[0].id = 'All';
          return resp;
        })
      );
  }

  getPromoCodeDetails(data) {
    return this.api.getPromoCodeDetails(data);
  }

  getPromoCodeDropdownValues() {
    return this.api.getPromoCodeDropdownValues()
      .pipe(map(resp => resp.data));
  }

  updatePromoCode(data) {
    return this.api.editPromoCode(data);
  }

  createPromoCode(data) {
    return this.api.createPromoCode(data);
  }

  generatePromoCode() {
    return this.api.generatePromoCode();
  }

  checkPromoCodeExistence(code) {
    return this.api.checkPromoCodeExistence(code)
      .pipe(
        map(() => of(true)),
        catchError((data) => {
          if (data && !data.success) {
            return of(false);
          }
          return of(true);
        })
      );
  }

  searchAdsStoreList(keyword) {
    return this.api.searchAdsStoreList({keyword})
      .pipe(
        catchError(() => of([]))
      );
  }

  upsertPromo(isAddPage, data) {
    return isAddPage
      ? this.createPromoCode(data)
      : this.updatePromoCode(data);
  }

  getFormConfig(isFormDisabled) {
    return {
      promo_title: ['', Validators.required],
      promo_code: ['', Validators.required],
      expiry_date: ['', Validators.required],
      hide_from_public: false,
      special_code: false,
      promo_location: 'All',
      customer_type: ['', Validators.required],
      promo_code_value_type: ['', Validators.required],
      promo_code_value: [null, Validators.required],
      promo_code_price_limit: null,
      promo_code_offer_type: 1,
      min_purchase_limit_type: ['', Validators.required],
      min_purchase_limit_value: null,
      purchase_count_type: ['', Validators.required],
      purchase_count_value: null,
      promo_usage_per_user: ['', Validators.required],
      promo_usage_per_user_value: null,
      store: [{value: '1', disabled: isFormDisabled}],
      is_scratch_card: false
    };
  }

  getPopulatedFormConfig(data) {
    const {
      promo_title,
      promo_code,
      expiry_date,
      hide_from_public,
      special_code,
      location_id = '',
      customer_type,
      code_pro_obj,
      min_purchase_obj,
      max_user_count_obj,
      promo_usage_obj,
      applied_store_obj,
      is_scratch_card
    } = data;
    return {
      promo_title,
      promo_code,
      expiry_date,
      hide_from_public,
      special_code,
      promo_location: location_id,
      customer_type,
      promo_code_value_type: code_pro_obj.value_type,
      promo_code_value: code_pro_obj.code_value,
      promo_code_offer_type: code_pro_obj.offer_type,
      promo_code_price_limit: code_pro_obj.price_limit,
      min_purchase_limit_type: min_purchase_obj.type,
      min_purchase_limit_value: min_purchase_obj.value,
      purchase_count_type: max_user_count_obj.type,
      purchase_count_value: max_user_count_obj.value,
      promo_usage_per_user: promo_usage_obj.type,
      promo_usage_per_user_value: promo_usage_obj.value_limit,
      store: applied_store_obj.store_id,
      is_scratch_card: is_scratch_card || false
    };
  }
}
