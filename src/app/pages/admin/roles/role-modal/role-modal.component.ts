import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/core/services/api.service';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { validateNotEmptyString } from '@app/validators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs/observable/of';
import { skipWhile } from 'rxjs/operators/skipWhile';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-role-modal',
  templateUrl: 'role-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  data;

  form: FormGroup;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private fb: FormBuilder,
    private api: ApiService,
    private cd: ChangeDetectorRef,
    private formHelper: FormHelperService
  ) {}

  ngOnInit() {
    this.initForm();
    this.checkNameDuplicate();
    this.setFormData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  close(): void {
    this.ngbActiveModal.close(this.form.value);
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  isFormValid() {
    return this.form.valid;
  }

  isInvalidField(fieldName) {
    const field = this[fieldName];
    return this.formHelper.isInvalidField(field);
  }

  private initForm() {
    const config = {
      name: ['', Validators.compose([
        Validators.required,
        validateNotEmptyString,
        Validators.minLength(3)
      ])],
      description: ['', Validators.required]
    };
    this.form = this.fb.group(config);
  }

  private setFormData() {
    if (!this.data) {
      return;
    }

    this.form.setValue(this.data);
    this.cd.markForCheck();
  }

  private checkNameDuplicate() {
    this.name.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        skipWhile((qry) => {
          if (this.data) {
            return this.data.name === qry;
          }
          return false;
        }),
        debounceTime(500),
        switchMap((qry) => {
          if (qry) {
            return this.api.checkRolesRole({qry});
          }

          return of(null);
        })
      )
      .subscribe((data) => {
        if (data && !data.success) {
          this.name.setErrors({'duplicatedField': true});
          this.cd.markForCheck();
        }
      });
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }
}
