import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SC_FORMAT_TEXT } from '@app/core/constants';
import { IdName } from '@app/core/models';
import { ConstantsService } from '@app/core/services/constants.service';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { validateDuplicates, validateNotEmptyString } from '@app/validators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-sc-custom-field-modal',
  templateUrl: 'sc-custom-field-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScCustomFieldModalComponent implements OnInit {
  form: FormGroup;
  formats: IdName[];
  data: any;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private fb: FormBuilder,
    private constantsService: ConstantsService,
    private formHelper: FormHelperService
  ) {}

  ngOnInit() {
    this.formats = this.constantsService.getListByKey('sc_format');
    this.initForm();
  }

  close(): void {
    this.ngbActiveModal.close(this.form.value);
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  private initForm() {
    const config = {
      key_name: '',
      display_name: ['', Validators.compose([
        Validators.required,
        validateNotEmptyString,
        Validators.minLength(3),
        validateDuplicates(this.data.fieldNames)
      ])],
      format: SC_FORMAT_TEXT,
      access: 2,
      default: null,
      required: true,
      req_inventory: false,
      req_store: false,
      req_user: false,
      is_searchable: true,
      description: ''
    };

    this.form = this.fb.group(config);
  }

  get display_name() {
    return this.form.get('display_name');
  }

  isInvalidField(fieldName) {
    const field = this[fieldName];
    return this.formHelper.isInvalidField(field);
  }
}
