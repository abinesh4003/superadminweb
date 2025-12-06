import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PROMOTION_MERCHANTS_ADS_TYPE_BANNER, PROMOTION_MERCHANTS_ADS_TYPE_TEXT } from '@app/core/constants';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { GlobalToasterService } from '@app/core/services/global-toaster.service';
import { PagesService } from '@app/pages/pages.service';
import { MerchantsAdsFormService } from '@app/pages/promotion/ads/merchants-ads/form/merchants-ads-form.service';
import { PromotionAdsMerchantsPermissionsConstants } from '@app/pages/promotion/ads/promotion-ads-permissions.constants';
import { CarouselService } from '@app/shared/components/carousel/carousel.service';
import { SharedHelperService } from '@app/shared/services/shared-helper.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { delay } from 'rxjs/operators/delay';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeWhile } from 'rxjs/operators/takeWhile';
import { tap } from 'rxjs/operators/tap';
import { Subject } from 'rxjs/Subject';
import { finalize } from 'rxjs/operators/finalize';
import { takeUntil } from 'rxjs/operators/takeUntil';
import * as moment from 'moment';

@Component({
  templateUrl: 'merchants-ads-form.component.html',
  styleUrls: ['./merchants-ads-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MerchantsAdsFormComponent implements OnInit, OnDestroy {
  isPageLoaded = false;
  rootBreadcrumbName: string;
  form: FormGroup;
  adsId: string;
  adTypes: any[] = [];
  storesLoading = false;
  perms = PromotionAdsMerchantsPermissionsConstants;
  stores$: Observable<any>;
  storeData;
  iconOptions = {path: 'sponsor/ad/icon', width: 150};
  bannerImageOptions = {path: 'sponsor/ad/adImg', width: 150};
  bannerImg: File | string;
  bannerImgDimensions: { width: number, height: number };
  minDpDate;
  storesTypeahead$ = new Subject<string>();

  private pageType: string;
  private ngUnsubscribe = new Subject();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: MerchantsAdsFormService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private pagesService: PagesService,
    private formHelper: FormHelperService,
    private carouselService: CarouselService,
    private sharedHelperService: SharedHelperService,
    private toaster: GlobalToasterService
  ) {
  }

  ngOnInit() {
    this.adTypes = this.service.getAdTypes();
    this.searchForStores();
    this.initMinDateForDP();

    this.route.paramMap
      .pipe(
        takeUntil(this.ngUnsubscribe),
        takeWhile((params) => params.has('page')),
        tap((params) => {
          this.pageType = params.get('page');
          this.adsId = params.get('adId') || null;
        }),
        switchMap(() => {
          this.initForm();
          this.handleValidation();
          return this.getItemData(this.adsId);
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((data) => {
        this.setLoadedData(data);
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });
  }

  isEditPage() {
    return this.pageType === 'edit';
  }

  isAddPage() {
    return this.pageType === 'add';
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  isFormDisabled() {
    return !this.hasPermission(this.perms.edit);
  }

  isInvalidField(fieldName) {
    const field = this.form.get(fieldName);
    return this.formHelper.isInvalidField(field);
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  private getItemData(id) {
    if (id && this.isEditPage()) {
      return this.service.viewMerchantsAds(id);
    }

    return of(null);
  }

  private setLoadedData(data) {
    if (!data) {
      return;
    }

    const {ad_type, paid_cost, text_ad_info, expiry_date, banner_ad_info} = data;
    const config = {
      ad_type,
      paid_cost,
      expiry_date
    };
    this.storeData = data;
    this.form.patchValue(config);

    const partialConfig = {};
    if (this.isTextType) {
      const ad_text = text_ad_info && text_ad_info.ad_content || '';
      Object.assign(partialConfig, {ad_text});
    } else if (this.isBannerType) {
      if (!banner_ad_info) {
        return;
      }
      const {image, width, height} = banner_ad_info;
      this.bannerImg = image || '';
      this.bannerImgDimensions = {width, height};
    }
    this.form.patchValue(partialConfig);
    this.cd.markForCheck();
  }

  private initMinDateForDP() {
    const now = moment();
    now.add(1, 'day');
    this.minDpDate = {year: now.year(), month: now.month() + 1, day: now.date()};
  }

  private searchForStores() {
    this.stores$ = this.storesTypeahead$
      .pipe(
        filter(keyword => keyword.trim().length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(keyword => {
          this.storesLoading = true;
          this.cd.detectChanges();
          return this.service.searchAdsStoreList(keyword).pipe(
            finalize(() => this.storesLoading = false),
            catchError(() => of([]))
          );
        }),
        delay(800)
      );
  }

  private handleValidation() {
    this.form.get('ad_type')
      .valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.isTextType) {
          this.form.addControl('ad_text', this.fb.control('', [Validators.compose([Validators.required, Validators.maxLength(140)])]));
        } else {
          this.form.removeControl('ad_text');
        }
      });
  }

  onToggleActivate() {
    this.service.deactivateMerchantsAds({
      ad_id: this.adsId,
      is_active: !this.storeData.is_active
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.navigateBack());
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.formHelper.showErrorForMissedFields(this.form.controls);
      return;
    }

    if (this.isBannerType && !this.bannerImg) {
      this.toaster.showError('Banner image is mandatory.');
      return;
    }

    const data = this.getPreparedFormData();
    const obs = this.isTextType
      ? this.service.updateMerchantsAdsUpdateText(data)
      : this.service.updateMerchantsAdsUpdateBanner(data);

    obs
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.navigateBack());
  }

  private getPreparedFormData() {
    const {ad_text, expiry_date, paid_cost} = this.form.value;
    const {merchant_id, _id, category_id, location} = this.isEditPage()
      ? this.storeData
      : this.form.get('selectedStore').value;

    const data = {
      expiry_date: moment(expiry_date).format('YYYY-MM-DD'),
      paid_cost,
      merchant_id,
      store_id: _id,
      category_id,
      store_location: location
    };

    if (this.isEditPage()) {
      Object.assign(data, {ad_id: this.adsId});
    }

    if (this.isTextType) {
      Object.assign(data, {ad_text: ad_text.trim()});

      return data;
    } else {
      Object.assign(data, {
        banner_width: this.bannerImgDimensions.width,
        banner_height: this.bannerImgDimensions.height
      });

      if (typeof this.bannerImg === 'string') {
        Object.assign(data, {image_name: this.bannerImg});
        return data;
      }

      Object.assign(data, {image_name: this.bannerImg.name});
      const formData = this.formHelper.getFormData(data);

      this.formHelper.handleFileFormData(formData, this.bannerImg, 'image');

      return formData;
    }
  }

  onImageChange(event) {
    this.bannerImg = event;

    this.sharedHelperService.getImageDimensions(this.bannerImg)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        this.bannerImgDimensions = result;
      });
  }

  onZoomBanner() {
    this.carouselService.open(this.bannerImg, this.bannerImageOptions.path)
      .subscribe();
  }

  get storeIcon() {
    if (this.isEditPage()) {
      return this.storeData.store_icon || '';
    }

    const store = this.form.get('selectedStore').value;
    return store && store.private && store.private.icon || '';
  }

  get isTextType() {
    return this.form.get('ad_type').value === PROMOTION_MERCHANTS_ADS_TYPE_TEXT;
  }

  get isBannerType() {
    return this.form.get('ad_type').value === PROMOTION_MERCHANTS_ADS_TYPE_BANNER;
  }

  isFormValid() {
    return this.form.valid;
  }

  onBack() {
    this.navigateBack();
  }

  getBreadcrumb() {
    if (this.isAddPage()) {
      return 'Create Ad';
    } else if (this.isTextType) {
      return 'Edit Text Ad';
    } else if (this.isBannerType) {
      return 'Edit Banner Ad';
    }
  }

  onBreadcrumbClick(event) {
    event.preventDefault();
    this.navigateBack();
  }

  private navigateBack() {
    const command = this.isEditPage() ? '../../' : '../';
    this.router.navigate([command], {relativeTo: this.route});
  }

  private initForm() {
    const config = this.service.getFormConfig(this.isEditPage());

    this.form = this.fb.group(config);
  }
}
