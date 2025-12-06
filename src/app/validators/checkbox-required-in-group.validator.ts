import { FormGroup } from '@angular/forms';

export function validateCheckboxRequiredInGroupValidator(group: FormGroup): Object {
  return isValid(group.value) ? null : {checkboxRequired: true};
}

function isValid(value) {
  return Object.values(value).some(item => item);
}
