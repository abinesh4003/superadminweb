import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IdName } from '@app/core/models';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { PagesService } from '@app/pages/pages.service';
import { PromoInventoryService } from '@app/pages/promotion/promo-code/inventory/promo-inventory.service';
import { PromoService } from '@app/pages/promotion/promo-code/promo.service';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { delay } from 'rxjs/operators/delay';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { finalize } from 'rxjs/operators/finalize';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { Subject } from 'rxjs/Subject';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { takeUntil } from 'rxjs/operators/takeUntil';

@Component({
  selector: 'pkz-promo-inventory',
  templateUrl: 'promo-inventory.component.html',
  styleUrls: ['./promo-inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromoInventoryComponent implements OnInit, OnDestroy {
  isPageLoaded = false;
  rootBreadcrumbName: string;
  form: FormGroup;
  locations$: Observable<IdName[]>;
  dropdownLists: {
    customer_type: any[],
    promo_code_limit_type: any[],
    promo_code_offer_type: any[],
    min_purchase_limit_type: any[],
    purchase_count_type: any[],
    store_name: any[],
    promo_usage_per_user: any[]
  };
  promoId: string;
  perms;
  storesTypeahead$ = new Subject<string>();
  storesLoading = false;
  stores$: Observable<any>;
  origStore;
  private promoSearch$: Subject<void> = new Subject<void>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private promoService: PromoService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: PromoInventoryService,
    private cd: ChangeDetectorRef,
    private formHelper: FormHelperService,
    private pagesService: PagesService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.perms = this.promoService.getPermissions(this.route);
    this.promoId = this.route.snapshot.paramMap.get('id');
    this.rootBreadcrumbName = this.promoService.getTabNameByRoute(this.route);
    this.locations$ = this.service.getLocationsList();
    this.initForm();
    this.handleOptionalValidation();
    this.checkPromoCodeDuplicate();

    forkJoin([
      this.service.getPromoCodeDropdownValues(),
      this.getItemData(this.promoId)
    ]).subscribe(([dropdownLists, formData]) => {
      this.setLoadedData(formData);
      this.searchForStores();
      this.dropdownLists = dropdownLists;
      this.isPageLoaded = true;
      this.cd.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isFormDisabled() {
    if (this.isAddPage) {
      return !this.hasPermission(this.perms.create);
    }
    return !this.hasPermission(this.perms.edit);
  }

  isInvalidField(fieldName) {
    const field = this.form.get(fieldName);
    return this.formHelper.isInvalidField(field);
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  get isAddPage() {
    return this.route.snapshot.routeConfig.path === 'add';
  }

  get isEditPage() {
    return this.route.snapshot.routeConfig.path === 'edit/:id';
  }

  onSave() {
    const data = this.getPreparedFormData();

    if (!this.isFormValid()) {
      this.formHelper.showErrorForMissedFields(this.form.controls);
      return;
    }

    const observable = this.service.upsertPromo(this.isAddPage, data);

    observable
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.navigateBack();
      });
  }

  isFormValid() {
    return this.form.valid;
  }

  private getPreparedFormData() {
    const {
      promo_location,
      promo_code_price_limit,
      min_purchase_limit_value,
      purchase_count_value,
      promo_usage_per_user_value,
      store,
      ...formData
    } = this.form.value;
    const data = {
      ...formData,
      promo_location: promo_location || 'All',
      store: store || '1',
      store_type: store && store !== '1' ? 2 : 1
    };

    if (this.isEditPage) {
      Object.assign(data, {_id: this.promoId});
    }

    Object.assign(data, {promo_code_price_limit: this.isVisiblePromoPriceLimit ? promo_code_price_limit : 0});
    Object.assign(data, {min_purchase_limit_value: this.isVisibleMinPurchaseLimit ? min_purchase_limit_value : 0});
    Object.assign(data, {purchase_count_value: this.isVisiblePurchaseCount ? purchase_count_value : 0});
    Object.assign(data, {promo_usage_per_user_value: this.isVisibleUsagePerUserValue ? promo_usage_per_user_value : 0});

    return data;
  }

  private navigateBack() {
    const command = this.isEditPage ? '../../' : '../';
    this.router.navigate([command], {relativeTo: this.route});
  }

  private initForm() {
    const config = this.service.getFormConfig(this.isFormDisabled());
    this.form = this.fb.group(config);
  }

  onGenerateCode() {
    this.service.generatePromoCode()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(code => {
        this.promo_code.setValue(code);
        this.promo_code.setErrors(null);
        this.cd.markForCheck();
      });
  }

  onTypePromo(event) {
    this.promoSearch$.next(event.target.value);
  }

  private checkPromoCodeDuplicate() {
    this.promoSearch$.asObservable()
      .pipe(
        debounceTime(300),
        switchMap((code) => {
          if (!code) {
            return of(null);
          }

          return this.service.checkPromoCodeExistence(code);
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((success) => {
        this.promo_code.setErrors(success ? null : {'duplicatedField': true});
        this.cd.markForCheck();
      });
  }

  private getItemData(id) {
    if (id && this.isEditPage) {
      return this.service.getPromoCodeDetails({_id: id});
    }

    return of(null);
  }

  private setLoadedData(data) {
    if (!data) {
      return;
    }
    this.origStore = data;
    this.form.setValue(this.service.getPopulatedFormConfig(data));
    this.cd.markForCheck();
  }

  private searchForStores() {
    this.stores$ = this.storesTypeahead$
      .pipe(
        filter((keyword: any) => keyword.trim().length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(keyword => {
          this.storesLoading = true;
          this.cd.detectChanges();
          return this.service.searchAdsStoreList(keyword).pipe(
            map((items) => this.getDefaultStores().concat(items)),
            finalize(() => this.storesLoading = false)
          );
        }),
        delay(800),
        startWith(this.getDefaultStores())
      );
  }

  private handleOptionalValidation() {
    [{
      main: 'promo_code_value_type',
      dependant: 'promo_code_price_limit'
    }, {
      main: 'min_purchase_limit_type',
      dependant: 'min_purchase_limit_value'
    }, {
      main: 'purchase_count_type',
      dependant: 'purchase_count_value'
    }, {
      main: 'promo_usage_per_user',
      dependant: 'promo_usage_per_user_value'
    }].forEach(({main, dependant}) => {
      this.form.get(main).valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((value) => {
          this.form.get(dependant).setValidators(value === 2 ? Validators.required : null);
          this.form.get(dependant).updateValueAndValidity();
        });
    });
  }

  get isVisiblePromoPriceLimit() {
    return this.form.get('promo_code_value_type').value === 2;
  }

  get isVisibleMinPurchaseLimit() {
    return this.form.get('min_purchase_limit_type').value === 2;
  }

  get isVisiblePurchaseCount() {
    return this.form.get('purchase_count_type').value === 2;
  }

  get isVisibleUsagePerUserValue() {
    return this.form.get('promo_usage_per_user').value === 2;
  }

  get promo_code() {
    return this.form.get('promo_code');
  }

  private getDefaultStores() {
    const stores = [{
      _id: '1',
      display_name: 'All'
    }];

    if (!this.isEditPage) {
      return stores;
    }

    const {store_name, store_id} = this.origStore.applied_store_obj;
    if (!store_id || store_id === '1') {
      return stores;
    }

    return stores.concat({_id: store_id, display_name: store_name});
  }
}
