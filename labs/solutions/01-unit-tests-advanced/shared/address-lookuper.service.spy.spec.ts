import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { assertType } from '../assert-type';
import { AddressLookuper } from './address-lookuper.service';
import * as parser from './parse-address';

describe('Pure Address Lookuper Unit Test', () => {
  it('should pass an invalid address', () => {
    jest.spyOn(parser, 'parseAddress').mockReturnValue({ street: 'Domgasse', streetNumber: '5' });

    const lookuper = new AddressLookuper(assertType<HttpClient>({ get: () => of([]) }));

    lookuper.lookup('Domgasse');
  });
});
