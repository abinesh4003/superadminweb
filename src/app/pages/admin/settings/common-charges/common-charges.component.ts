import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonChargesService } from '@app/pages/admin/settings/common-charges/common-charges.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

@Component({
  selector: 'pkz-common-charges',
  templateUrl: 'common-charges.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonChargesComponent implements OnInit, OnDestroy {
  settings;
  form: FormGroup;
  formPercentValuesArray: {label: string, type: string}[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private service: CommonChargesService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formPercentValuesArray = this.service.getPercentValuesArray();
    this.initForm();

    this.service.getCommonChargesSettings()
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
    this.service.updateCommonChargesSettings(this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  private initForm() {
    const config = this.service.getFormConfig();

    this.form = this.fb.group(config);
  }

  private setFormData(data) {
    this.form.patchValue(data);
  }
}
