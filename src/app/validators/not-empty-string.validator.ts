import { FormControl } from '@angular/forms';

export function validateNotEmptyString(control: FormControl): Object {
  return isValid(control.value) ? null : {emptyString: true};
}

function isValid(value) {
  if (!value || typeof value !== 'string') {
    return true;
  }

  const isWhitespace = value.trim().length === 0;

  return !isWhitespace;
}
