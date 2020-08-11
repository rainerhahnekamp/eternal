import { TestBed } from '@angular/core/testing';

import { AddressLookup } from './address-lookup.service';

describe('AddressLookupService', () => {
  let service: AddressLookup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressLookup);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
