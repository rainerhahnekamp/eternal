import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AddressLookuper } from './address-lookuper.service';
import { mock } from './mock';

jest.mock('./parse-address');

describe('Address Lookuper', () => {
  it('should work with invalid addresses', (done) => {
    const lookuper = new AddressLookuper(
      mock<HttpClient>({ get: () => of(['']) })
    );

    lookuper.lookup('Domgasse').subscribe((isValid) => {
      expect(isValid).toBe(true);
      done();
    });
  });
});
