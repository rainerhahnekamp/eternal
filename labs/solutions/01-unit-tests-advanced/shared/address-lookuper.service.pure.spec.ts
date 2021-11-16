import { HttpClient } from '@angular/common/http';
import { waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { AddressLookuper } from './address-lookuper.service';
import { assertType } from './assert-type';

jest.mock('./parse-address', () => ({
  parseAddress: () => {}
}));

describe('Address Lookuper', () => {
  it(
    'should work with invalid addresses',
    waitForAsync(() => {
      const lookuper = new AddressLookuper(assertType<HttpClient>({ get: () => of(['']) }));

      lookuper.lookup('Domgasse').subscribe((isValid) => {
        expect(isValid).toBe(true);
      });
    })
  );
});
