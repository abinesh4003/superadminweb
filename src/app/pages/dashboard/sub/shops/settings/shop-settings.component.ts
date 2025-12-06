import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelperService} from '@app/core/services/form-helper.service';
import {AppState, getShopStatusTab, getSubCategoryId} from '@app/store/root-reducer';
import {Store} from '@ngrx/store';
import {zip} from 'rxjs/observable/zip';
import {finalize} from 'rxjs/operators/finalize';
import {skipWhile} from 'rxjs/operators/skipWhile';
import {mergeMap} from 'rxjs/operators/mergeMap';
import {tap} from 'rxjs/operators/tap';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute, Router} from '@angular/router';
import {ShopsSubService} from '../shops-sub.service';
import {PagesService} from '@app/pages/pages.service';
import {CarouselService} from '@app/shared/components/carousel/carousel.service';
import {takeWhile} from 'rxjs/operators/takeWhile';
import {ShopSettingsService} from './shop-settings.service';
import * as moment from 'moment';
import {filter} from "rxjs/operators/filter";
import {distinctUntilChanged} from "rxjs/operators/distinctUntilChanged";
import {debounceTime} from "rxjs/operators/debounceTime";
import {switchMap} from "rxjs/operators/switchMap";
import {delay} from "rxjs/operators/delay";
import {Observable} from "rxjs/Observable";
import {isNullOrUndefined} from "util";
import {map} from "rxjs/operators";

@Component({
  selector: 'pkz-shop-settings',
  templateUrl: './shop-settings.component.html',
  styleUrls: ['./shop-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopSettingsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private tabId: number;
  private storeId: string;
  private categoryId: string;
  private pageType: string;

  shopIcon: File | string | null;
  rootBreadcrumbName: string;
  perms;
  imageOptions = {path: 'shop/ick/vw', width: 150};
  form: FormGroup;
  isPageLoaded = false;
  isPrivateShop = false;
  estimatedFreeMonthsDate;
  isAllowedDeleteImage = false;
  shopName: string;
  storeData: any;
  affectedProductsCount = '';
  isSubmittingFee = false;
  agencies$: Observable<any>;
  agenciesTypeahead$ = new Subject<string>();
  agenciesLoading = false;
  endDate: any;
  status = '';
  merchantName: string;
  EMPTY_MERCHANT = 'Search and select';
  merchantId: string;
  isSelectedAgencyInvalid = false;
  isAgencyUPInvalid = false;
  isAgencySKUInvalid = false;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private shopSettingsService: ShopSettingsService,
    private shopsSubService: ShopsSubService,
    private pagesService: PagesService,
    private carouselService: CarouselService,
    private store: Store<AppState>,
    private router: Router,
    private formHelper: FormHelperService
  ) {
  }

  ngOnInit() {
    zip(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      this.store.select(getSubCategoryId),
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        takeWhile(([{id}, {tabId, page}, categoryId]) => !!id && !!tabId && !!categoryId && !!page),
        tap(([{id}, {tabId, page}, categoryId]) => {
          this.perms = this.shopsSubService.getPermissions(tabId);
          this.tabId = +tabId;
          this.pageType = page;
          this.storeId = id;
          this.categoryId = categoryId;
          this.shopsSubService.changeShopsStatusTab(this.tabId);
          this.rootBreadcrumbName = this.shopsSubService.getStatusName(this.tabId);
        }),
        mergeMap(() => {
          this.initForm();
          this.handleFreeMonthsChange();
          return this.shopsSubService.getItemData(this.categoryId, this.storeId);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data) => {
        this.searchForAgency();
        this.setLoadedData(data);
        this.storeData = data;
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });

    this.store.select(getShopStatusTab)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        skipWhile(tabId => tabId === this.tabId)
      )
      .subscribe(() => this.navigateToShopsStore());
  }

  private initForm(): void {
    const config = {
      free_months: ['', Validators.required],
      upc_limit: ['', Validators.required],
      sku_limit: ['', Validators.required],
      upc_limit_stock: ['', Validators.required],
      sku_limit_stock: ['', Validators.required],
      upc_commission_cost: ['', Validators.required],
      sku_commission_cost: ['', Validators.required],
      subscription_cost_per_month: ['', Validators.required],
      subscription_renewal_date: ['', Validators.required],
      merchant_wallet: [''],
      agency_upc_commission_cost: [''],
      agency_sku_commission_cost: [''],
      agency_including_fee: false,
      including_delivery_fee: false,
      including_fee: false,
      selectedAgency: [null]
    };

    this.form = this.fb.group(config);
  }

  public sortedMethods(paymentMethods) {
    if(paymentMethods) {
      const primary = paymentMethods.find(method => method.is_primary);
      return [primary, ...paymentMethods.filter(method => method.account_id !== primary.account_id)];
    }
   return [];
  }

  private searchForAgency() {
    this.agencies$ = this.agenciesTypeahead$
      .pipe(
        filter((keyword: any) => keyword.trim().length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(keyword => {
          this.agenciesLoading = true;
          this.cd.detectChanges();
          return this.shopSettingsService.searchAgencies(keyword).pipe(
            map((items) => this.transformSearchItems(items)),
            finalize(() => this.agenciesLoading = false)
          );
        }),
        delay(800),
        // startWith([])
      );
  }

  private transformSearchItems(items) {
    return items.map(item => {
      return {
        ...item,
        value: {first_name: item.first_name, last_name: item.last_name, merchant_id: item.merchant_id},
        label: `${item.first_name} ${item.last_name}`
      }
    });
  }

  onApplyFee() {
    if (!this.isFormValid()) {
      this.formHelper.showErrorForMissedFields(this.form.controls);
      return;
    }
    const data = {
      c_id: this.categoryId,
      s_id: this.storeId
    };
    this.isSubmittingFee = true;
    this.affectedProductsCount = '';

    this.shopSettingsService.updateDashboardShopStoreSettings(
      this.getPreparedFormData()
    )
      .pipe(
        mergeMap(() => this.shopSettingsService.resetServiceFee(data)),
        finalize(() => {
          this.isSubmittingFee = false;
          this.cd.markForCheck();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(resp => {
        if (resp && resp.nUpserted) {
          this.affectedProductsCount = resp.nUpserted;
        }
      });
  }

  setLoadedData(data) {
    if (!data) {
      return;
    }
    this.shopName = data.display_name;

    this.isPrivateShop = data.private && data.private.is_enabled;

    if (!data.settings) {
      return;
    }

    const settings = data.settings;
    const formConfig = {
      free_months: settings.free && settings.free.months || 6,
      upc_limit: settings.upc.limit.product,
      sku_limit: settings.sku.limit.product,
      upc_limit_stock: settings.upc.limit.stock,
      sku_limit_stock: settings.sku.limit.stock,
      upc_commission_cost: settings.upc.commission,
      sku_commission_cost: settings.sku.commission,
      including_fee: isNullOrUndefined(settings.including_pay_fee) ? false : settings.including_pay_fee,
      merchant_wallet: data.wallet.available ? data.wallet.available.toFixed(2) : 0,
      agency_upc_commission_cost: settings.agency ? settings.agency.upc_commission_cost : '',
      agency_sku_commission_cost: settings.agency ? settings.agency.sku_commission_cost : '',
      agency_including_fee: settings.agency ? settings.agency.including_pay_fee : false,
      including_delivery_fee: settings.agency ? settings.agency.including_delivery_fee : false,
      selectedAgency: null
    };

    if (settings.agency && settings.agency.merchant_id && data.settings.agency.merchant_name) {
      this.merchantName = data.settings.agency.merchant_name;
      this.merchantId = settings.agency.merchant_id;
    } else {
      this.merchantName = this.EMPTY_MERCHANT;
    }

    if (this.isPrivateShop && data.private.settings) {
      this.shopIcon = data.private.icon;

      const rental = data.private.settings.rental;
      formConfig['subscription_cost_per_month'] = data.private && data.private.settings.rental ? data.private.settings.rental.fee : 0;
      formConfig['subscription_renewal_date'] = (rental && rental.renewal_date) ? rental.renewal_date : '';
      this.endDate = (rental && rental.end_date) ? moment(rental.end_date).format('DD/MM/YYYY') : '';
      this.status = data.status === 0 ? 'Failure' : data.status === 1 ? 'Success' : '';
    }
    this.form.patchValue(formConfig);
    this.cd.markForCheck();
  }

  isViewPage() {
    return this.pageType === 'view';
  }

  isEditPage() {
    return this.pageType === 'edit';
  }

  isFormDisabled() {
    return this.isViewPage();
  }

  private handleFreeMonthsChange() {
    this.free_months.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((month) => {
        month = parseInt(month, 10);

        if (!Number.isInteger(month)) {
          this.estimatedFreeMonthsDate = '';
          return;
        }

        this.estimatedFreeMonthsDate = moment().add(month, 'months').format('DD/MM/YYYY');
      });
  }

  private getPreparedFormData() {
    const {
      free_months,
      upc_limit,
      sku_limit,
      upc_limit_stock,
      sku_limit_stock,
      upc_commission_cost,
      sku_commission_cost,
      subscription_cost_per_month,
      including_fee,
      selectedAgency,
      agency_upc_commission_cost,
      agency_sku_commission_cost,
      agency_including_fee,
      including_delivery_fee,
      subscription_renewal_date,
    } = this.form.getRawValue();
    const privateSettings = this.isPrivateShop ? {subscription_cost_per_month} : {};

    const data = {
      including_fee,
      free_months,
      upc_limit,
      sku_limit,
      upc_limit_stock,
      sku_limit_stock,
      upc_commission_cost,
      sku_commission_cost,
      store_id: this.storeId,
      subscription_renewal_date: moment(subscription_renewal_date).toDate(),
      ...privateSettings
    };
    if (selectedAgency) {
      data['agency_settings'] = {
        merchant_id: selectedAgency.merchant_id,
        merchant_name: `${selectedAgency.first_name} ${selectedAgency.last_name}`,
        upc_commission_cost: agency_upc_commission_cost,
        sku_commission_cost: agency_sku_commission_cost,
        including_pay_fee: agency_including_fee,
        including_delivery_fee: including_delivery_fee
      };
    }
    const formData = this.formHelper.getFormData(data);

    if (this.isPrivateShop && !this.isImageSaved()) {
      this.formHelper.handleFileFormData(formData, this.shopIcon, 'shop_icon');
    }

    return formData;
  }

  onSave(): void {
    if (!this.isFormValid()) {
      this.formHelper.showErrorForMissedFields(this.form.controls);
      return;
    }

    this.shopSettingsService.updateDashboardShopStoreSettings(
      this.getPreparedFormData()
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.navigateToShopsStore();
        this.cd.markForCheck();
      });
  }

  onImageChange(event) {
    if (this.isImageSaved() && this.isAllowedDeleteImage) {
      this.shopSettingsService.deleteShopIconImage(this.storeId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.shopIcon = event;
          this.cd.markForCheck();
        });
    } else {
      this.shopIcon = event;
    }
  }

  private isImageSaved() {
    return typeof this.shopIcon === 'string';
  }

  onZoom() {
    this.carouselService.open(this.shopIcon, this.imageOptions.path)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  navigateToShopsStore() {
    this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
  }

  isInvalidField(fieldName) {
    const field = this.getFormField(fieldName);
    return this.formHelper.isInvalidField(field);
  }

  isEmptyField(fieldName) {
    const field = this.getFormField(fieldName);
    return !field.value || !(field.value.toString().length > 0);
  }

  isMerchantSettingsDisabled() {
    return this.isEmptyField('selectedAgency') && !this.merchantId;
  }

  onViewStore(event) {
    event.preventDefault();
    const queryParams = {
      tabId: this.tabId
    };
    this.router.navigate(['../shops/view', this.storeData._id], {
      relativeTo: this.activatedRoute.parent, queryParams
    });
  }

  get isActiveTab() {
    return this.tabId === 2;
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  isSaveAllowed() {
    return this.hasPermission(this.perms.edit);
  }

  onCancel() {
    this.navigateToShopsStore();
  }

  get free_months() {
    return this.form.get('free_months');
  }

  getFormField(fieldName) {
    return this.form.get(fieldName);
  }

  private isFormValid() {
    if (this.storeData.settings.agency && this.storeData.settings.agency.merchant_id && this.isEmptyField('selectedAgency')) {
      let names = [];
      names = this.storeData.settings.agency.merchant_name.split(' ');
      this.form.controls['selectedAgency'].setValue({
        merchant_id: this.storeData.settings.agency.merchant_id,
        first_name: names.length > 0 ? names[0] : '',
        last_name: names.length > 1 ? names[1] : ''
      });
    }
    return this.form.valid && this.checkIfAgencySettingsValid();
  }

  private checkIfAgencySettingsValid() {
    if (this.isEmptyField('selectedAgency') &&
      this.isEmptyField('agency_upc_commission_cost') &&
      this.isEmptyField('agency_sku_commission_cost')) {
      return true;
    } else {
      if (this.isEmptyField('selectedAgency') ||
        this.isEmptyField('agency_upc_commission_cost') ||
        this.isEmptyField('agency_sku_commission_cost')) {
        this.isSelectedAgencyInvalid = this.isEmptyField('selectedAgency');
        this.isAgencySKUInvalid = this.isEmptyField('agency_sku_commission_cost');
        this.isAgencyUPInvalid = this.isEmptyField('agency_upc_commission_cost');
        return false;
      }
    }
    return true;
  }

  public isAgencyFieldInvalid(fieldName) {
    if (this.isEmptyField('selectedAgency') &&
      this.isEmptyField('agency_upc_commission_cost') &&
      this.isEmptyField('agency_sku_commission_cost')) {
      return false;
    } else if (this.isEmptyField(fieldName)) {
      return true;
    }
  }

  public openMerchantSettingsModal() {
    let merchantId = this.merchantId;
    if (this.getFormField('selectedAgency').value && this.getFormField('selectedAgency').value.merchant_id) {
      merchantId = this.getFormField('selectedAgency').value.merchant_id;
    }
    this.shopSettingsService.openMerchantSettingsModal(this.storeId, merchantId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }
}
