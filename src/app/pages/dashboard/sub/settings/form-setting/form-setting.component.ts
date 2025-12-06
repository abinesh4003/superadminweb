import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagesService } from '@app/pages/pages.service';
import { AppState, getSettingsTab, getSubCategoryId } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { tap } from 'rxjs/operators/tap';
import { Subject } from 'rxjs/Subject';
import { SettingSubService } from '../setting-sub.service';
import {
  SettingsSubBasicPermissionsConstants,
  SettingsSubGeneralPermissionsConstants,
  SettingsSubPrivatePermissionsConstants
} from '../settings-sub-permissions.constants';


@Component({
  selector: 'pkz-form-setting',
  templateUrl: './form-setting.component.html',
  styleUrls: ['./form-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSettingComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private categoryId: string;
  private tabId: number;
  private reInitData: BehaviorSubject<number> = new BehaviorSubject(Date.now());
  isGeneric: boolean;
  isPublic: boolean;
  isPrivate: boolean;
  isBranded: boolean;
  form: FormGroup;
  cartTypes = Array<string>();
  frameSizes = Array<string>();
  tooltips = Array<string>();
  subscriptionAmount: number;
  quarterly: number;
  halfyearly: number;
  yearly: number;
  monthPrice: number;
  isGeneralEdit: boolean;
  isBasicEdit: boolean;
  isPrivateEdit: boolean;
  durationUnits = ['Day(s)', 'Hour(s)'];
  cancelStageList = [{
    id: 1,
    name: 'Ordered'
  }, {
    id: 2,
    name: 'Accepted'
  }, {
    id: 3, name: 'Ready to Ship'
  }, {
    id: 4,
    name: 'Shipping'
  }];

  constructor(
    public settingSubService: SettingSubService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private pagesService: PagesService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    combineLatest(
      this.store.select(getSubCategoryId),
      this.store.select(getSettingsTab),
      this.reInitData
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(this.initAssociatedData.bind(this)),
        switchMap(() => {
          this.initForm();
          this.handleCancelStageChange();
          return this.getItemData(this.categoryId);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data) => {
        this.setLoadedData(data);

        this.cd.markForCheck();
      });

  }

  private initAssociatedData([categoryId, tabId]) {
    if (this.tabId !== tabId || this.categoryId !== categoryId) {
      this.categoryId = categoryId;
      this.tabId = tabId;
      this.isGeneric = this.settingSubService.isGeneric(tabId);
      this.isPublic = this.settingSubService.isPublic(tabId);
      this.isPrivate = this.settingSubService.isPrivate(tabId);
      this.isBranded = this.settingSubService.isBranded(tabId);
      this.isGeneralEdit = this.isGeneralEditable();
      this.isBasicEdit = this.isBasicEditable();
      this.isPrivateEdit = this.isPrivateEditable();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public initForm() {
    const setGeneralInitialValue = {value: null, disabled: !this.isGeneralEditable()};
    const setBasicInitialValue = {value: null, disabled: !this.isBasicEditable()};
    const setPrivateInitialValue = {value: null, disabled: !this.isPrivateEditable()};

    const config = {
      cartType: [setGeneralInitialValue, Validators.required],
      publicShopStatus: [setBasicInitialValue, {checked: true}],
      cashOnDelivery: [setGeneralInitialValue, {checked: true}],
      deliveryInfoDuration: setGeneralInitialValue,
      deliveryInfoDurationUnit: setGeneralInitialValue,
      isLocked: setGeneralInitialValue,
      otherLocationEnabled: setGeneralInitialValue,
      otherDeliveryInfoDuration: setGeneralInitialValue,
      otherDeliveryInfoDurationUnit: setGeneralInitialValue,
      commissionsCost: [setBasicInitialValue, {value: ''}, Validators.required],
      replacement: [setGeneralInitialValue, Validators.required],
      refund: [setGeneralInitialValue, Validators.required],
      maximumProductMargin: [setGeneralInitialValue, Validators.required],
      negativeCost: setGeneralInitialValue,
      maximumDeliveryDistance: [setGeneralInitialValue, Validators.required],
      cashbackOffer: setBasicInitialValue,
      maxPurchaseAmount: setBasicInitialValue,
      minPurchaseAmount: setBasicInitialValue,
      subscriptionAmount: setPrivateInitialValue,
      quarterly: setPrivateInitialValue,
      halfyearly: setPrivateInitialValue,
      yearly: setPrivateInitialValue,
      defaultInventory: [setGeneralInitialValue, Validators.required],
      defaultShopproductFrameSize: [setBasicInitialValue, Validators.required],
      defaultProductStockLimit: [setGeneralInitialValue, Validators.required],
      tooltip_blue: setGeneralInitialValue,
      tooltip_lightgreen: setGeneralInitialValue,
      tooltip_green: setGeneralInitialValue,
      tooltip_turquoise: setGeneralInitialValue,
      tooltip_red: setGeneralInitialValue,
      privateCommissionsCost: [setPrivateInitialValue, Validators.required],
      privateShopproductFrameSize: setPrivateInitialValue,
      privateCashbackOffer: setPrivateInitialValue,
      privateMinPurchaseAmount: setPrivateInitialValue,
      privateMaxPurchaseAmount: setPrivateInitialValue,
      ordersDeliveryNotes: setGeneralInitialValue,
      ordersDeliveryAttachment: setGeneralInitialValue,
      allow_auto_openclose: setGeneralInitialValue,
      enable_delivery: setGeneralInitialValue,
      is_restaurants: setGeneralInitialValue,
      is_food_items: setGeneralInitialValue,
      ordersDeliveryEnableSubscription: setGeneralInitialValue,
      cancelStageSelected: this.fb.group(
        this.cancelStageList.reduce((prev, curr) => {
          prev[curr.id] = {value: false, disabled: !this.isGeneralEditable()};

          return prev;
        }, {})
      )
    };
    this.form = this.fb.group(config);
  }

  isGeneralEditable() {
    return this.hasPermission(SettingsSubGeneralPermissionsConstants.edit);
  }

  isBasicEditable() {
    return this.hasPermission(SettingsSubBasicPermissionsConstants.edit);
  }

  isPrivateEditable() {
    return this.hasPermission(SettingsSubPrivatePermissionsConstants.edit);
  }


  private hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  public setLoadedData(data) {
    const formData = data[0].data.settings;
    const features = data[0].data.features;
    this.cartTypes = data[1].data.type;
    this.frameSizes = data[2].data.type;
    this.tooltips = data[3].data.tooltip;
    this.monthPrice = formData.private.rent.amount_per_month;

    const tooltips = data[0].data.tooltip;
    this.form.patchValue({
      cartType: formData.general.cart_type,
      publicShopStatus: formData.basic.is_enabled,
      isLocked: formData.general.delivery.other.is_cod,
      otherLocationEnabled: formData.general.delivery.other.is_enabled,
      cashOnDelivery: formData.general.delivery.local.is_cod,
      deliveryInfoDuration: formData.general.delivery.local.duration,
      deliveryInfoDurationUnit: formData.general.delivery.local.duration_unit,
      otherDeliveryInfoDuration: formData.general.delivery.other.duration,
      otherDeliveryInfoDurationUnit: formData.general.delivery.other.duration_unit,
      commissionsCost: formData.basic.order.commission,
      replacement: formData.general.replacement.days,
      refund: formData.general.refund.days,
      maximumProductMargin: formData.general.product.margin.profit,
      negativeCost: formData.general.product.margin.loss,
      maximumDeliveryDistance: formData.general.delivery.local.radius,
      cashbackOffer: formData.basic.order.cashback.offer_percent,
      maxPurchaseAmount: formData.basic.order.cashback.offer_upto,
      minPurchaseAmount: formData.basic.order.cashback.min_purchase,
      subscriptionAmount: formData.private.rent.amount_per_month,
      quarterly: formData.private.rent.type[1].percent,
      halfyearly: formData.private.rent.type[2].percent,
      yearly: formData.private.rent.type[3].percent,
      defaultInventory: formData.general.product.limit.product,
      defaultShopproductFrameSize: formData.basic.frame_type,
      defaultProductStockLimit: formData.general.product.limit.stock,
      tooltip_blue: this.getTooltip(tooltips, 1) ? this.getTooltip(tooltips, 1).key_id : 100,
      tooltip_lightgreen: this.getTooltip(tooltips, 2) ? this.getTooltip(tooltips, 2).key_id : 100,
      tooltip_green: this.getTooltip(tooltips, 3) ? this.getTooltip(tooltips, 3).key_id : 100,
      tooltip_turquoise: this.getTooltip(tooltips, 4) ? this.getTooltip(tooltips, 4).key_id : 100,
      tooltip_red: this.getTooltip(tooltips, 5) ? this.getTooltip(tooltips, 5).key_id : 100,
      privateCommissionsCost: formData.private.order.commision,
      privateShopproductFrameSize: formData.private.frame_type,
      privateCashbackOffer: formData.private.order.cashback.offer_percent,
      privateMinPurchaseAmount: formData.private.order.cashback.min_purchase,
      privateMaxPurchaseAmount: formData.private.order.cashback.offer_upto,
      ordersDeliveryNotes: features.notes,
      allow_auto_openclose: formData.general.allow_auto_openclose,
      enable_delivery: formData.general.enable_delivery,
      is_restaurants: formData.general.is_restaurants,
      is_food_items: formData.general.is_food_items,
      ordersDeliveryAttachment: features.upload,
      ordersDeliveryEnableSubscription: features.enable_subscription
    });

    if (data[0].data.cancel_stage) {
      this.cancelStageSelected.patchValue({[data[0].data.cancel_stage.selected_stage]: true});
    }
    this.quarterly = this.countAmount(formData.private.rent.type[1].percent, 3);
    this.halfyearly = this.countAmount(formData.private.rent.type[2].percent, 6);
    this.yearly = this.countAmount(formData.private.rent.type[3].percent, 12);
  }

  getTooltip(tooltips, id) {
    return tooltips.find(el => el.tooltip_id === id);
  }

  changeAmount(event, month) {
    switch (month) {
      case 3:
        this.quarterly = this.countAmount(event.srcElement.value, 3);
        break;
      case 6:
        this.halfyearly = this.countAmount(event.srcElement.value, 6);
        break;
      case 12:
        this.yearly = this.countAmount(event.srcElement.value, 12);
        break;
    }
  }

  changeMonthPrice(event, qpercent, hpercent, ypercent) {
    this.monthPrice = event.srcElement.value;
    this.quarterly = this.countAmount(qpercent, 3);
    this.halfyearly = this.countAmount(hpercent, 6);
    this.yearly = this.countAmount(ypercent, 12);
  }

  private countAmount(percent, month) {
    return this.monthPrice * percent * month / 100;
  }

  private getItemData(categoryId) {
    if (categoryId) {
      return combineLatest(
        this.settingSubService.getCategorySettings(categoryId),
        this.settingSubService.getCategoryCartTypes(),
        this.settingSubService.getServiceTypes(),
        this.settingSubService.getCategoryTooltips(categoryId)
      );
    }

    return of(null);
  }

  getPrivateDataFromForm() {
    const formData = this.form.getRawValue();
    return {
      private_frame_type: formData.privateShopproductFrameSize,
      private_order_commission: formData.privateCommissionsCost,
      private_order_cashback_offer_percent: formData.privateCashbackOffer,
      private_order_cashback_offer_upto: formData.privateMaxPurchaseAmount,
      private_order_cashback_min_purchase: formData.privateMinPurchaseAmount,
      private_rent: {
        amount_per_month: formData.subscriptionAmount,
        type: [
          {
            name: 'monthly',
            months: 1,
            percent: 100
          },
          {
            name: 'quarterly',
            months: 3,
            percent: formData.quarterly
          },
          {
            name: 'halfyearly',
            months: 6,
            percent: formData.halfyearly
          },
          {
            name: 'yearly',
            months: 12,
            percent: formData.yearly
          }
        ]
      }
    };
  }

  getBasicDataFromForm() {
    const formData = this.form.getRawValue();
    return {
      basic_is_enabled: formData.publicShopStatus,
      basic_frame_type: formData.defaultShopproductFrameSize,
      basic_order_commission: formData.commissionsCost,
      basic_order_cashback_offer_percent: formData.cashbackOffer,
      basic_order_cashback_offer_upto: formData.maxPurchaseAmount,
      basic_order_cashback_min_purchase: formData.minPurchaseAmount
    };
  }

  getGeneralDataFromForm() {
    const formData = this.form.getRawValue();
    const data = {
      general_cart_type: formData.cartType,
      general_delivery_local_radius: formData.maximumDeliveryDistance,
      general_delivery_local_is_cod: formData.cashOnDelivery,
      general_delivery_local_duration: formData.deliveryInfoDuration,
      general_delivery_local_duration_unit: formData.deliveryInfoDurationUnit,
      general_delivery_other_duration: formData.otherDeliveryInfoDuration,
      general_delivery_other_duration_unit: formData.otherDeliveryInfoDurationUnit,
      general_features_notes: formData.ordersDeliveryNotes,
      allow_auto_openclose: formData.allow_auto_openclose,
      enable_delivery: formData.enable_delivery,
      is_restaurants: formData.is_restaurants,
      is_food_items: formData.is_food_items,
      general_features_upload: formData.ordersDeliveryAttachment,
      general_is_subscription_selected: formData.ordersDeliveryEnableSubscription,
      general_delivery_other_is_enabled: formData.otherLocationEnabled,
      general_delivery_other_is_cod: true,
      general_product_limit_product: formData.defaultInventory,
      general_product_limit_stock: formData.defaultProductStockLimit,
      general_product_margin_profit: formData.maximumProductMargin,
      general_product_margin_loss: formData.negativeCost,
      general_refund_days: formData.refund,
      general_replacement_days: formData.replacement,
      general_tooltip: [],
      general_cancel_stage_selected: this.getCancelStageFirstSelectedValue()
    };
    this.pushTooltip(data.general_tooltip, +formData.tooltip_blue, 1);
    this.pushTooltip(data.general_tooltip, +formData.tooltip_lightgreen, 2);
    this.pushTooltip(data.general_tooltip, +formData.tooltip_green, 3);
    this.pushTooltip(data.general_tooltip, +formData.tooltip_turquoise, 4);
    this.pushTooltip(data.general_tooltip, +formData.tooltip_red, 5);
    return data;
  }

  private getCancelStageFirstSelectedValue() {
    const selected = Object.entries(this.cancelStageSelected.value).find(([key, value]) => value);

    return selected ? +selected[0] : null;
  }

  pushTooltip(array, key_id, tooltip_id) {
    if (key_id !== 100) {
      array.push({
        key_id: key_id,
        key_name: this.selectValue(key_id),
        tooltip_id: tooltip_id
      });
    }
  }

  selectValue(id) {
    return this.tooltips.filter(el => {
      return el['key_id'] === id;
    })[0] ? this.tooltips.filter(el => {
      return el['key_id'] === id;
    })[0]['display_name'] : ' ';
  }

  onGeneralApply() {
    if (this.form.valid) {
      this.settingSubService.updateCategorySetting(this.categoryId, this.getGeneralDataFromForm(), 'general')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe();
    }
  }

  onBasicApply() {
    if (this.form.valid) {
      this.settingSubService.updateCategorySetting(this.categoryId, this.getBasicDataFromForm(), 'basic')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe();
    }
  }

  onPrivateApply() {
    if (this.form.valid) {
      this.settingSubService.updateCategorySetting(this.categoryId, this.getPrivateDataFromForm(), 'private')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe();
    }
  }

  private handleCancelStageChange() {
    this.cancelStageSelected.valueChanges.subscribe(data => {
      const selected = this.getCancelStageFirstSelectedValue();
      const res = Object.entries(data).reduce((prev, [key, value]) => {
        if (selected && +key >= selected) {
          prev[key] = true;
        } else {
          prev[key] = value;
        }

        return prev;
      }, {});

      this.cancelStageSelected.setValue(res, {emitEvent: false});
    });
  }

  get cancelStageSelected() {
    return this.form.get('cancelStageSelected');
  }
}
