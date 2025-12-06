import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { PagesService } from '@app/pages/pages.service';
import { AdsScratchCardService } from '@app/pages/promotion/ads/scratch-card/ads-scratch-card.service';
import { PromotionAdsScratchCardPermissionsConstants } from '@app/pages/promotion/ads/promotion-ads-permissions.constants';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  templateUrl: 'ads-scratch-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdsScratchCardComponent implements OnInit, OnDestroy {
  isPageLoaded = false;
  rows: any[];
  form: FormGroup;
  perms = PromotionAdsScratchCardPermissionsConstants;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private service: AdsScratchCardService,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private formHelper: FormHelperService
  ) {
  }

  ngOnInit() {
    this.loadPageData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onMoneyReward() {
    this.service.openMoneyRewardModal()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onOfferReward() {
    this.service.openOfferCodeRewardModal()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onSave() {
    if (!this.isFormValid()) {
      this.formHelper.showErrorForMissedFields(this.form.controls);
      return;
    }
    const {enabled: is_enabled, budgetPerDay: per_day_budget} = this.form.value;

    this.service.updateSettings({
      is_enabled,
      per_day_budget
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (!data) {
          return;
        }
        this.rows = data.scard_history || [];
        this.cd.detectChanges();
      });
  }

  isFormDisabled() {
    return !this.isEditAllowed();
  }

  isEditAllowed() {
    return this.hasPermission(this.perms.edit);
  }

  private hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  isInvalidField(fieldName) {
    const field = this.form.get(fieldName);
    return this.formHelper.isInvalidField(field);
  }

  private isFormValid() {
    return this.form.valid;
  }

  private loadPageData() {
    this.service.getScardSettings()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (!data) {
          return;
        }
        this.rows = data.scard_history || [];
        this.initForm(data.scard_settings);
        this.isPageLoaded = true;
        this.cd.detectChanges();
      });
  }

  private initForm(settings) {
    const config = {
      enabled: settings.is_enabled,
      budgetPerDay: [settings.per_day_budget, Validators.required]
    };
    this.form = this.fb.group(config);
  }
}
