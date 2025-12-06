import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GlobalToasterService } from '@app/core/services/global-toaster.service';

@Injectable()
export class FormHelperService {
  constructor(
    private fb: FormBuilder,
    private toaster: GlobalToasterService,
  ) {}

  getArrayControls(items, isDisabled = false) {
    return items.map(value => this.fb.control({value, disabled: isDisabled}));
  }

  getControls(form, fieldName) {
    return (<FormArray>form.get(fieldName)).controls;
  }

  hasFormError(form, errorName) {
    return form.invalid && form.errors[errorName] && (form.dirty || form.touched);
  }

  isInvalidField(field) {
    return field.invalid && (field.dirty || field.touched);
  }

  setAllControlsDirty(controls: {[key: string]: AbstractControl|FormGroup}): void {
    Object.keys(controls)
      .map(key => controls[key])
      .forEach((value: AbstractControl) => {
        if (value instanceof FormGroup) {
          this.setAllControlsDirty(value.controls);
        } else {
          value.markAsDirty({onlySelf: true});
        }
      });
  }

  showErrorForMissedFields(controls) {
    this.setAllControlsDirty(controls);
    this.showErrorToaster();
  }

  showErrorToaster() {
    this.toaster.showFormFieldError();
  }

  handleFileFormData(formData, file, fieldName) {
    if (!file) {
      return;
    }

    formData.append(fieldName, file, file.name);
  }

  getFormData(formValue, prevData?) {
    const formData: FormData = new FormData();

    if (prevData) {
      this.setFormValues(formData, prevData);
    }

    this.setFormValues(formData, formValue);

    return formData;
  }

  private setFormValues(formData, values) {
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((el, index) => {
          formData.set(`${key}[${index}]`, this.trimStr(el));
        });
      } else if (typeof value === 'object' && value !== null) {
        formData.set(key, JSON.stringify(value));
      } else {
        formData.set(key, this.trimStr(value));
      }
    });
  }

  private trimStr(str) {
    return (typeof str === 'string') ? str.trim() : str;
  }
}
