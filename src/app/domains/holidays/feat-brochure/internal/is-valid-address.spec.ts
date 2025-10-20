import { isValidAddress } from './is-valid-address';

describe('isValidAddress', () => {
  for (const address of [
    'Domgasse 5',
    'Domgasse 5, 1010 Wien',
    'Am Tor 5',
    'Schillerstrasse 1, 2700 Wiener Neustadt',
    'Schillerstraße 1, 2700 Wiener Neustadt',
    'Am Tor 5, 1029 Neußerburg',
    'Dietrichsplatz 1/3/5, 1010 Wien',
  ]) {
    it(`should return true for "${address}"`, () => {
      expect(isValidAddress(address)).toBe(true);
    });
  }
});
