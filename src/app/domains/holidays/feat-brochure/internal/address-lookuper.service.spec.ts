import { AddressLookuper } from './address-lookuper.service';
import { TestBed } from '@angular/core/testing';
import { ADDRESS_SUPPLIER } from './address-supplier';
import { describe, it, expect } from 'vitest';

describe('Address Lookuper', () => {
  const setup = (addresses: string[]) => {
    TestBed.configureTestingModule({
      providers: [{ provide: ADDRESS_SUPPLIER, useValue: addresses }],
    });
  };

  it('should pass addresses in the constructor', () => {
    setup(['Domgasse 5, 1010 Wien']);
    const lookuper = TestBed.inject(AddressLookuper);

    expect(lookuper.lookup('Domgasse 15, 1010 Wien')).toBe(false);
    expect(lookuper.lookup('Domgasse 5, 1010 Wien')).toBe(true);
  });

  it('should count the queries', () => {
    setup([]);
    const lookuper = TestBed.inject(AddressLookuper);
    expect(lookuper.counter).toBe(0);
    lookuper.lookup('Domgasse 5');
    expect(lookuper.counter).toBe(1);
  });
});
