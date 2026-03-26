import { AddressLookuper } from './address-lookuper.service';
import { TestBed } from '@angular/core/testing';
import { ADDRESS_SUPPLIER } from './address-supplier';
import { describe, it, expect } from 'vitest';
import { delay, lastValueFrom, of } from 'rxjs';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('Address Lookuper', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const ctrl = TestBed.inject(HttpTestingController);
    const lookuper = TestBed.inject(AddressLookuper)
    return { ctrl, lookuper }
  };

  it.each([{
    query: 'Domgasse 15, 1010 Wien', isValid: false
  }, {
    query: 'Domgasse 5, 1010 Wien', isValid: true
  }
  ])(`should return $isValid for $query`, async ({ query, isValid }) => {
    const { lookuper, ctrl } = setup()

    const lookupPromise = lastValueFrom(lookuper.lookup(query));
    ctrl.expectOne(req => {
      return Boolean(req.url.match(/nominatim/))
    }).flush(['Domgasse 5, 1010 Wien'])

    expect(await lookupPromise).toBe(isValid)
  });

  it('should verify that right urls and params are used', async () => {
    const { lookuper, ctrl } = setup();
    lookuper.lookup('Domgasse 5').subscribe()

    ctrl.expectOne(req => {
      expect.soft(req.url).toBe('https://nominatim.openstreetmap.org/search.php')
      expect.soft(req.params.get('format')).toBe('jsonv2')
      expect.soft(req.params.get('q')).toBe('Domgasse 5')
      expect.soft(req.params.keys()).toHaveLength(2)
      return true;
    })
  })

  // it('should count the queries', () => {
  //   setup([]);
  //   const lookuper = TestBed.inject(AddressLookuper);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse 5');
  //   expect(lookuper.counter).toBe(1);
  // });
});
