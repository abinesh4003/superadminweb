import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormHelperService} from "@app/core/services/form-helper.service";
import {ApiService} from "@app/core/services/api.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'pkz-merchant-settings-modal',
  templateUrl: './merchant-settings-modal.component.html',
  styleUrls: ['./merchant-settings-modal.component.scss']
})
export class MerchantSettingsModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  form: FormGroup;
  data: any;
  merchant_id: any;

  constructor(private ngbActiveModal: NgbActiveModal,
              private fb: FormBuilder,
              private formHelper: FormHelperService,
              private apiService: ApiService,
              private cd: ChangeDetectorRef,) {
  }

  ngOnInit() {
    console.log('THIS.DATA - ', this.data);
    this.initForm();
    if (this.data.store_id) {
      this.apiService.getAgencySettings({store_id: this.data.store_id})
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(data => {
          this.setLoadedData(data);
        })
    }
  }

  setLoadedData(data) {
    if (!data) {
      return;
    }

    const settings = data.agency_settings;
    const is_delivery_agency = data.is_delivery_agency;
    this.merchant_id = data.merchant_id;

    const formConfig = {
      is_delivery_agency,
      agency_setup_fee: settings.agency_setup_fee,
      agency_deposit: settings.agency_deposit,
      max_shop_attachment: settings.max_shop_attachment,
    };

    this.form.patchValue(formConfig);
    this.cd.markForCheck();
  }

  private initForm() {
    const config = {
      is_delivery_agency: false,
      agency_setup_fee: ['', Validators.required],
      agency_deposit: ['', Validators.required],
      max_shop_attachment: ['', Validators.required],
    };

    this.form = this.fb.group(config);
  }

  onSave(): void {
    if (this.form.valid) {
      const {
        is_delivery_agency,
        agency_setup_fee,
        agency_deposit,
        max_shop_attachment
      } = this.form.getRawValue();
      const data = {
        merchant_id: this.merchant_id,
        is_delivery_agency,
        agency_settings: {
          agency_setup_fee,
          agency_deposit,
          max_shop_attachment,
        }
      };
      this.apiService.saveAgencySettings(data)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(_ => {
          this.ngbActiveModal.close();
        });
    }
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  getFormField(fieldName) {
    return this.form.get(fieldName);
  }

  isInvalidField(fieldName) {
    const field = this.getFormField(fieldName);
    return this.formHelper.isInvalidField(field);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
