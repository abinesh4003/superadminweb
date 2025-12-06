import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { ManageOffersService } from '@app/pages/finance/offers/manage/manage-offers.service';
import { FinanceManageOffersPermissionsConstants } from '@app/pages/finance/offers/offers-permissions.constants';
import { PagesService } from '@app/pages/pages.service';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-manage-offers',
  templateUrl: 'manage-offers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOffersComponent implements OnInit, OnDestroy {
  form: FormGroup;
  perms = FinanceManageOffersPermissionsConstants;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private service: ManageOffersService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private formHelper: FormHelperService,
    private pagesService: PagesService
  ) {}

  ngOnInit() {
    this.initForm();

    this.service.getManageOfferSettings()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.setFormData(data);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onApply() {
    if (!this.isFormValid()) {
      this.formHelper.showErrorForMissedFields(this.form.controls);
      return;
    }

    this.service.updateManageOffers(this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  isFormDisabled() {
    return !this.hasPermission(this.perms.edit);
  }

  private isFormValid () {
    return this.form.valid;
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  isInvalidField(fieldName) {
    const field = this.form.get(fieldName);
    return this.formHelper.isInvalidField(field);
  }

  private initForm() {
    const config = this.service.getFormConfig();

    this.form = this.fb.group(config);
  }

  private setFormData(data) {
    this.form.patchValue(data);
    this.cd.detectChanges();
  }
}
