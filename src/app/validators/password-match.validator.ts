import { FormGroup } from '@angular/forms';

export function validatePasswordMatch(group: FormGroup): Object {
  return isValid(group.value) ? null : {mismatch: true};
}

function isValid(values) {
  const [firstPass, secondPass] = Object.values(values);

  return firstPass === secondPass;
}
