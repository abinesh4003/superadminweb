import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DB_SHOP_STATUS_LIVE, DB_SHOP_STATUS_SUSPENDED } from '@app/core/constants';
import { Category, IdName } from '@app/core/models';
import { ShopFormApiService } from '@app/pages/dashboard/sub/shops/form/shop-form-api.service';
import { ShopFormService } from '@app/pages/dashboard/sub/shops/form/shop-form.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { startWith } from 'rxjs/operators/startWith';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map } from 'rxjs/operators/map';
import { skipWhile } from 'rxjs/operators/skipWhile';
import { switchMap } from 'rxjs/operators/switchMap';
import { concatMap } from 'rxjs/operators/concatMap';
import { tap } from 'rxjs/operators/tap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState, getShopStatusTab, getSubCategoryId } from '@app/store/root-reducer';
import { ShopsSubService } from '../shops-sub.service';
import { PagesService } from '@app/pages/pages.service';
import { CarouselService } from '@app/shared/components/carousel/carousel.service';
import { takeWhile } from 'rxjs/operators/takeWhile';
import { ShopListService } from '../list/shop-list.service';
import * as moment from 'moment';

@Component({
  selector: 'pkz-shop-form',
  templateUrl: './shop-form.component.html',
  styleUrls: ['./shop-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private pageType: string;
  private tabId: number;
  private storeId: string;
  private categoryId: string;

  isPageLoaded = false;
  form: FormGroup;
  rootBreadcrumbName: string;
  isShownFeedbackError = false;
  shopIcon: File | string | null;
  shopData;
  shopImages;
  perms;
  imageOptions = { path: 'shop/ick/vw', width: 200 };
  deliveryDistance;
  fg;
  amountOfShop;
  showBtnViewOtherShops: boolean;
  privateStoreEnabled: boolean;
  shopFirstImage: any;
  storeTypes$: Observable<IdName[]>;
  storeCategories$: Observable<Category[]>;
  deliveryMethods: any[] = [];
  countries$: Observable<any>;
  states: any[];
  cities: {
    state: string;
    _id: string;
    name: string;
  }[];
  feedbackErrorTextPart: string;
  otherDeliveryIsLock: boolean;
  mobileNumbers;
  deliveryLimitTypes = [{id: 'limit', name: 'Limit'}, {id: 'any', name: 'Any'}];
  shopAvailability: any[];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private apiService: ShopFormApiService,
    private service: ShopFormService,
    private store: Store<AppState>,
    private router: Router,
    private shopsSubService: ShopsSubService,
    private shopListService: ShopListService,
    private pagesService: PagesService,
    private carouselService: CarouselService
  ) {}

  ngOnInit() {
    this.shopAvailability = this.service.getShopAvailability();

    zip(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      this.store.select(getSubCategoryId),
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        takeWhile(([{ page }, { tabId }, categoryId]) => !!page && !!tabId && !!categoryId),
        tap(([{ page, id }, { tabId, amountOfShop }, categoryId]) => {
          this.perms = this.shopsSubService.getPermissions(tabId);
          this.tabId = +tabId;
          this.pageType = page;
          this.storeId = id;
          this.amountOfShop = amountOfShop;
          this.showBtnViewOtherShops = (this.amountOfShop > 1);
          this.categoryId = categoryId;
          this.shopsSubService.changeShopsStatusTab(this.tabId);
          this.rootBreadcrumbName = this.shopsSubService.getStatusName(this.tabId);
        }),
        concatMap(() => this.apiService.getDashboardShopDeliveryTypes()),
        tap((deliveryMethods) => {
          this.deliveryMethods = deliveryMethods;
        }),
        switchMap(() => {
          this.initForm();
          return this.shopsSubService.getItemData(this.categoryId, this.storeId);
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((data) => {
        this.handleCountryChange();
        this.handleLocalCOD();
        this.handleDeliveryCODChange();
        this.initAsyncListsData();
        this.setLoadedData(data);
        this.initStoreCategories();
        this.formFieldsChangeBehavior();
        this.isPageLoaded = true;

        this.cd.markForCheck();
      });

    this.store.select(getShopStatusTab)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        skipWhile(tabId => tabId === this.tabId)
      )
      .subscribe(() => this.navigateToShopsTable());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private handleDeliveryCODChange() {
    this.deliveryCODLimitType.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        if (!value) {
          return;
        }
        const field = this.deliveryCODLimitValue;

        if (this.isAnyCODLimitType()) {
          field.disable();
          return;
        }

        if (this.cashOnDelivery.value) {
          field.enable();
        }
      });
  }

  private handleLocalCOD() {
    this.cashOnDelivery.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        const deliveryCODLimitType = this.deliveryCODLimitType;
        const deliveryCODLimitValue = this.deliveryCODLimitValue;

        if (!value) {
          deliveryCODLimitType.disable();
          deliveryCODLimitValue.disable();
          return;
        }

        deliveryCODLimitType.enable();

        if (!this.isAnyCODLimitType()) {
          deliveryCODLimitValue.enable();
        }
      });
  }

  private navigateToShopsTable() {
    this.router.navigate(['../shops'], { relativeTo: this.activatedRoute.parent });
  }

  isEditPage() {
    return this.pageType === 'edit';
  }

  isViewPage() {
    return this.pageType === 'view';
  }

  isFormDisabled() {
    return this.isViewPage();
  }

  isProductSuspended() {
    return this.shopData.status === DB_SHOP_STATUS_SUSPENDED;
  }

  onBreadcrumbClick(event) {
    event.preventDefault();
    this.navigateToShopsTable();
  }

  private initForm(): void {
    const config = this.service.getFormConfig(this.isActiveTab());

    this.form = this.fb.group(config);
  }

  private initStoreCategories() {
    const type = this.storeType.value;

    this.storeCategories$ = this.apiService.getShopsCategory({type, status: DB_SHOP_STATUS_LIVE, skip: 0, limit: 100});
  }

  private initAsyncListsData() {
    this.storeTypes$ = this.apiService.getDashboardShopsCategoryTypes();
    this.countries$ = this.apiService.getUsersUserLocation();
  }

  private handleCountryChange() {
    this.form.get('country').valueChanges
      .pipe(
        distinctUntilChanged(),
        concatMap((country) => this.apiService.getUsersUserLocationFilter(country)),
        tap((resp) => {
          const statesAll = resp.map(item => item.state);

          this.states = Array.from(new Set(statesAll)).sort();
        }),
        mergeMap((allCities) => {
          const field = this.form.get('state');

          return field.valueChanges
            .pipe(
              startWith(field.value),
              map((selectedState) => {
                return allCities.filter(({state}) => state === selectedState);
              })
            );
        }),
        tap(cities => {
          const cityId = this.shopData.address.location._id;
          const isCityInList = cities.some(city => city._id === cityId);
          const value = isCityInList ? cityId : null;

          this.form.get('city').setValue(value);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((cities) => {
        this.cities = cities;
        this.cd.markForCheck();
      });
  }

  onChangePrivateToggle(isEnabled) {
    this.apiService.updateDashboardShopStore(this.storeId, {enable_private_shop: isEnabled})
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.privateStoreEnabled = isEnabled;
        this.cd.detectChanges();
      });
  }

  private handleShopTypes() {
    this.storeType
      .valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((type) => {
        const value = (type === this.shopData.store_type) ? this.categoryId : '';
        this.form.get('storeCategory').setValue(value);
        this.initStoreCategories();
      });
  }

  setLoadedData(data) {
    if (!data) {
      return;
    }

    this.handleMobileNumbersData(data);
    this.form.patchValue({
      storeType: data.category_type,
      storeCategory: data.category_id,
      storeName: data.display_name,
      storeAddress: data.address.street,
      ...this.getMobilesNumbersData(),
      emailId: data.email,
      city: data.address.location._id,
      state: data.address.location.state,
      pincode: data.address.zipcode,
      country: data.address.location.country,
      productReplacement: data.replacement.days,
      refundWithin: data.refund.days,
      ...this.service.getLocalDeliveryData(data),
      ...this.service.getOtherDeliveryData(data),
      userFeedback: this.userFeedback.value,
      feedback: data.feedback ? data.feedback : this.feedback.value,
      latitude: data.location.coordinates[0],
      longitude: data.location.coordinates[1]
    });
    this.shopData = data;
    this.shopIcon = data.private.icon;
    this.shopFirstImage = (data.images && data.images.length) ? data.images[0].name : '';
    this.shopImages = data.images;
    this.privateStoreEnabled = data.private.is_enabled;
    this.otherDeliveryIsLock = data.delivery.other.is_locked;
    this.fg = this.shopsSubService.getListOfRadiuses();

    this.addControlsToForm(this.deliveryMethods, 'otherDeliveryMethod', data.delivery.other.type);
    this.addControlsToForm(this.deliveryMethods, 'deliveryMethod', data.delivery.local.type);
    this.addControlsToForm(this.shopAvailability, 'availability', data.availability);
  }

  private addControlsToForm(items, fieldName, values) {
    items
      .map(item => item._id || item.id)
      .forEach(id => {
        const formGroup = (this.form.get(fieldName) as FormGroup);
        const isChecked = values.includes(id);
        formGroup.addControl(id, new FormControl(isChecked));
      });
  }

  private getMobilesNumbersData() {
    const {primary, secondary} = this.mobileNumbers;

    if (primary.is_verified) {
      this.form.get('primaryMobileNo').disable();
    }

    if (secondary.is_verified) {
      this.form.get('secondaryMobileNo').disable();
    }

    return {
      primaryMobileNo: primary.number,
      secondaryMobileNo: secondary.number,
      primaryMobileDialCode: primary.dialing_code,
      secondaryMobileDialCode: secondary.dialing_code
    };
  }

  private handleMobileNumbersData(data) {
    this.mobileNumbers = this.service.handleMobileNumbersData(data);
  }

  onApprove() {
    if (this.form.valid) {
      this.apiService.shopStoreApproved(this.storeId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.navigateToShopsTable();
        });
    }
  }

  onSave() {
    const dataToUpdate = this.getDataFromForm();
    if (!Object.keys(dataToUpdate).length || !this.isFormValid()) {
      return;
    }

    this.apiService.updateDashboardShopStore(this.storeId, dataToUpdate)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.navigateToShopsTable();
      });
  }

  private isFormValid() {
    return this.form.valid;
  }

  changingStateOfLock() {
    if (!this.isEditPage()) {
      return;
    }

    this.otherDeliveryIsLock = !this.otherDeliveryIsLock;
    const data = {
      delivery_other_is_locked: this.otherDeliveryIsLock
    };
    this.apiService.updateDashboardShopStore(this.storeId, data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  getDataFromForm() {
    const formData = this.form.getRawValue();

    return {
      ...this.getMobileNumbersFormData(formData),
      ...this.getCODLimitStatusFormData(formData),
      ...this.getFilteredFormData(formData),
      ...this.getDeliveryTimeFormData(formData),
      ...this.getCoordinatesFormData(formData)
    };
  }

  private getDeliveryTimeFormData(formData) {
    const isDirtyFrom = this.isDirtyField('deliveryTimeFrom');
    const isDirtyTo = this.isDirtyField('deliveryTimeTo');

    if (!isDirtyFrom && !isDirtyTo) {
      return {};
    }

    const result = {};
    if (isDirtyFrom) {
      result['delivery_local_from'] = this.formatDeliveryTime(formData.deliveryTimeFrom);
    }

    if (isDirtyTo) {
      result['delivery_local_to'] = this.formatDeliveryTime(formData.deliveryTimeTo);
    }

    return result;
  }

  private formatDeliveryTime(formTime) {
    const {hour, minute} = formTime;

    return moment({ hour, minute}).toISOString();
  }

  private getFilteredFormData(formData) {
    const data = {
      category_id: 'storeCategory',
      display_name: 'storeName',
      email_id: 'emailId',
      address_zipcode: 'pincode',
      address_street: 'storeAddress',
      address_location_id: 'city',
      replacement_days: 'productReplacement',
      refund_days: 'refundWithin',
      delivery_local_radius: 'deliveryDistance',
      delivery_local_is_cod: 'cashOnDelivery',
      delivery_local_type: 'deliveryMethod',
      delivery_local_fee: 'deliveryFee',
      delivery_local_fee_limit: 'feeLimit',
      delivery_other_is_enabled: 'otherDeliveryIsEnable',
      delivery_other_is_cod: 'otherCashOnDelivery',
      delivery_other_fee: 'otherDeliveryFee',
      delivery_other_fee_limit: 'otherFeeLimit',
      delivery_other_type: 'otherDeliveryMethod',
      availability: 'availability'
    };
    const res = {};

    Object.entries(data)
      .forEach(([key,  value]) => {
        if (!this.isDirtyField(value)) {
          return;
        }

        if (['deliveryMethod', 'otherDeliveryMethod', 'availability'].includes(value)) {
          res[key] = Object.entries(formData[value])
            .filter(([id, isChecked]) => isChecked)
            .map(([id]) => {
              return isNaN(+id) ? id : +id;
            });
        } else {
          res[key] = formData[value];
        }
      });


    return res;
  }

  private getCoordinatesFormData(formData) {
    const {latitude, longitude} = formData;

    if (this.isDirtyField('latitude') || this.isDirtyField('longitude')) {
      return {
        coordinates: [+longitude, +latitude]
      };
    }

    return {};
  }

  private getCODLimitStatusFormData(formData) {
    const type = formData.deliveryCODLimitType;
    const value = formData.deliveryCODLimitValue;
    const isCod = formData.cashOnDelivery;

    if (!isCod) {
      return {};
    }

    if (type === this.isAnyCODLimitType() && this.isDirtyField('deliveryCODLimitType')) {
      return { delivery_local_is_cod_limit_type: type };
    }

    const res = {};

    if (this.isDirtyField('deliveryCODLimitType')) {
      res['delivery_local_is_cod_limit_type'] = type;
    }

    if (this.isDirtyField('deliveryCODLimitValue')) {
      res['delivery_local_is_cod_limit'] = value;
    }

    return res;
  }

  private getMobileNumbersFormData(formData) {
    const res = {};
    const {primary, secondary} = this.mobileNumbers;

    if (this.isDirtyField('primaryMobileNo') && (!primary || !primary.is_verified)) {
      res['mobile_primary'] = {
        dialing_code: formData.primaryMobileDialCode,
        number: formData.primaryMobileNo
      };
    }

    if (this.isDirtyField('secondaryMobileNo') && (!secondary || !secondary.is_verified)) {
      res['mobile_secondary'] = {
        dialing_code: formData.secondaryMobileDialCode,
        number: formData.secondaryMobileNo
      };
    }

    return res;
  }

  private isDirtyField(fieldName) {
    return this.form.get(fieldName).dirty;
  }

  private isAnyCODLimitType() {
    return this.deliveryCODLimitType.value === 'any';
  }

  onSuspend() {
    this.feedbackErrorTextPart = 'suspend';
    this.changeStatusWithFeedback('suspend');
  }


  onTerminate() {
    this.feedbackErrorTextPart = 'rejection to the merchant';
    this.changeStatusWithFeedback('terminate');
  }

  onReject() {
    this.feedbackErrorTextPart = 'termination';
    this.changeStatusWithFeedback('reject');
  }

  private changeStatusWithFeedback(action) {
    const data = {
      feedback: this.getUserFeedback(),
    };
    const shopName = this.storeName.value;
    const message = `Changes not saved!, are you still want to ${action} <b>${shopName}</b>?`;
    let observable;

    if (this.form.dirty) {
      observable = this.modalAfterFormChanged(message);
    } else if (this.isUserFeedbackValid()) {
      observable = this.pagesService.confirmActionModal(shopName, action);
    } else {
      this.isShownFeedbackError = true;
      return;
    }

    observable
      .pipe(
        takeUntil(this.ngUnsubscribe),
        concatMap(() => {
          switch (action) {
            case 'suspend':
              return this.apiService.suspendDashboardShopStore(this.storeId, data);
            case 'terminate':
              return this.apiService.terminateDashboardShopStore(this.storeId, data);
            case 'reject':
              return this.apiService.shopStoreRejected(this.storeId, data);
            default:
              throw Error('Specify valid action');
          }
        })
      )
      .subscribe(() => {
        this.isShownFeedbackError = false;
        this.feedbackErrorTextPart = '';
        this.navigateToShopsTable();
      });
  }

  private getUserFeedback() {
    return this.userFeedback.value;
  }

  private isUserFeedbackValid() {
    const feedback = this.getUserFeedback();

    return !!feedback && feedback.trim().length > 0;
  }

  getSubBreadcrumbName() {
    return this.storeName.value;
  }

  private modalAfterFormChanged(message) {
    return this.service.modalAfterFormChanged(message, this.form.dirty);
  }

  private formFieldsChangeBehavior() {
    this.handleShopTypes();
    this.handleFeedbackChange();
  }

  private handleFeedbackChange() {
    this.userFeedback.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.isUserFeedbackValid()) {
          this.isShownFeedbackError = false;
        }
        this.userFeedback.markAsPristine();
      });
  }

  onCancel() {
    const message = 'Do you want to Cancel and go back?';
    this.modalAfterFormChanged(message)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.navigateToShopsTable();
      });
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  isSaveAllowed() {
    return this.hasPermission(this.perms.edit) && this.isEditPage();
  }

  isApproveAllowed() {
    return this.hasPermission(this.perms.approve);
  }

  isTerminateAllowed() {
    return this.hasPermission(this.perms.terminate);
  }

  isSuspendAllowed() {
    return this.hasPermission(this.perms.suspend);
  }

  isFeedbackAllowed() {
    return this.isRejectAllowed();
  }

  isRejectAllowed() {
    return this.hasPermission(this.perms.reject);
  }

  isFeedbackHistoryBtnAllowed() {
    const feedback = this.feedback.value;
    return Array.isArray(feedback) && feedback.length > 0;
  }

  openFeedbackHistory() {
    const data = {
      messages: this.feedback.value,
      feedback: this.getUserFeedback(),
      isFeedbackAllowed: this.isFeedbackAllowed()
    };
    this.service.openFeedbackHistory(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(message => {
        this.userFeedback.setValue(message);
      });
  }

  isWFRTab() {
    return this.shopsSubService.isWFRTab(this.tabId);
  }

  isActiveTab() {
    return this.shopsSubService.isActiveTab(this.tabId);
  }

  showMap() {
    this.shopListService.viewLocation(this.shopData.location.coordinates);
  }

  onZoomIcon() {
    this.carouselService.open(this.shopIcon, this.imageOptions.path)
      .subscribe();
  }

  onZoomImage() {
    this.carouselService.open(this.shopFirstImage, 'shop/img/vw')
      .subscribe();
  }

  onNavToSettings() {
    const queryParams = {
      tabId: this.tabId,
      page: this.pageType,
    };
    this.router.navigate(['../shops/settings', this.storeId], {
      relativeTo: this.activatedRoute.parent,
      queryParams
    });
  }

  openShopImagesReview() {
    this.service.openShopImagesReview(this.shopImages);
  }

  onNavToShopInventory() {
    const queryParams = {
      tabId: this.tabId,
      page: this.pageType,
      category: this.categoryId
    };
    this.router.navigate(['../shops/inventory', this.storeId], {
      relativeTo: this.activatedRoute.parent,
      queryParams
    });
  }

  get deliveryCODLimitType() {
    return this.form.get('deliveryCODLimitType');
  }

  get deliveryCODLimitValue() {
    return this.form.get('deliveryCODLimitValue');
  }

  get cashOnDelivery() {
    return this.form.get('cashOnDelivery');
  }

  get storeType() {
    return this.form.get('storeType');
  }

  get storeName() {
    return this.form.get('storeName');
  }

  get otherDeliveryIsEnable() {
    return this.form.get('otherDeliveryIsEnable');
  }

  get feedback() {
    return this.form.get('feedback');
  }

  get userFeedback() {
    return this.form.get('userFeedback');
  }
}
