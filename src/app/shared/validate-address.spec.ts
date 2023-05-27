import { validateAddress } from './validate-address';
import { describe, expect, it } from '@jest/globals';
import { FormControl } from '@angular/forms';

describe('validateAddress', () => {
  it.each([
    { address: 'Domgasse 5', name: 'Simple Address' },
    { address: 'Domgasse 5, 1010 Wien', name: 'German format with city and zip' },
    { address: 'Domgasse 5, 2700 Wiener Neustadt', name: 'city consisting of multiple words' }
  ])('should validate a %s', ({ address }) => {
    const formControl = new FormControl(address);
    expect(validateAddress(formControl)).toBeNull();
  });

  it('should be invalid if no street number is given', () => {
    expect(validateAddress(new FormControl('Domgasse'))).toEqual({ address: false });
  });

  it('should fail is input is not a string', () => {
    expect(validateAddress(new FormControl(5))).toEqual({ address: false });
  });
});
