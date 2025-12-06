import { FormControl } from '@angular/forms';

export function validateDuplicates(items) {
  return function(control: FormControl): Object {
    return isValid(control.value, items) ? null : {duplicatedField: true};
  };
}

function isValid(value, items) {
  if (!value || typeof value !== 'string') {
    return true;
  }

  return !items.includes(value.trim().toLowerCase());
}
