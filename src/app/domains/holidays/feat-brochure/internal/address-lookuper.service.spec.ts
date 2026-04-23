import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { asyncScheduler, first, of, scheduled } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { AddressLookuper } from './address-lookuper.service';
import { ADDRESS_SUPPLIER } from './address-supplier';

describe('Address Lookuper', () => {
  const setup = (addresses: string[]) => {
    TestBed.configureTestingModule({
      providers: [{ provide: ADDRESS_SUPPLIER, useValue: addresses }],
    });
  };

  it('should use of', () => {
    let a = 1;
    of(1).subscribe((value) => (a += value));
    expect(a).toBe(2);
  });

  it.each([
    { response: [], isValid: false },
    { response: ['Domgasse 15, 1010 Wien'], isValid: true },
  ])(`should return $isValid for $query`, async ({ response, isValid }) => {
    const httpClient = {
      get: () => scheduled([response], asyncScheduler),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    });
    const lookuper = TestBed.inject(AddressLookuper);
    let result = undefined as undefined | boolean;
    lookuper
      .lookup('Domgasse 5')
      .pipe(first())
      .subscribe((v) => (result = v));

    await expect.poll(() => result).toBe(isValid);
  });

  it('should use the right parameters', async () => {
    const httpClient = { get: vitest.fn(() => of([])) };
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    });

    const lookuper = TestBed.inject(AddressLookuper);
    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search.php',
      { params: { q: 'Domgasse 5', format: 'jsonv2' } },
    );
  });

  // it('should count the queries', () => {
  //   setup([]);
  //   const lookuper = TestBed.inject(AddressLookuper);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse 5');
  //   expect(lookuper.counter).toBe(1);
  // });
});
