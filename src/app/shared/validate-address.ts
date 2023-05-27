import { AbstractControl, isFormControl, ValidatorFn } from '@angular/forms';

export const validateAddress: ValidatorFn = (ac: AbstractControl) => {
  if (!isFormControl(ac)) {
    throw new Error('Address Validator can be applied to a Form Control');
  }
  const { value } = ac;
  if (typeof value !== 'string') {
    return { address: false };
  }
  const shortPattern = /^([\w\s]+)\s(\d+)$/;
  const longPattern = /^([\w\s]+)\s(\d+),\s(\d+)\s([\w\s]+)$/;
  let match: string[] | null = value.match(shortPattern);

  if (match) {
    return null;
  } else {
    match = value.match(longPattern);
    if (match) {
      return null;
    }
  }

  return { address: false };
};
