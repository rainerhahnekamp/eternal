import { AddressLookuper } from './address-lookuper.service';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  AddressLookuperFake,
  provideAddressLookuperFake,
} from './address-lookuper-fake';

const wait = (timeout = 0) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

describe('Address Lookuper', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const lookuper = TestBed.inject(AddressLookuper);
    const ctrl = TestBed.inject(HttpTestingController);

    return { lookuper, ctrl };
  };

  for (const { query, expected, response } of [
    { query: 'Domgasse 5', response: ['Domgasse 5'], expected: true },
    { query: 'Domgasse 15', response: [], expected: false },
  ]) {
    it(`should return ${expected} for ${query}`, async () => {
      const { ctrl, lookuper } = setup();

      const validResource = TestBed.runInInjectionContext(() =>
        lookuper.lookup(() => query),
      );
      await wait();
      ctrl
        .expectOne(
          `https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=${encodeURIComponent(query)}`,
        )
        .flush(response);
      await wait();

      expect(validResource.status()).toBe('resolved');
      expect(validResource.value()).toBe(expected);
    });
  }

  for (const { query, expected } of [
    { query: 'Domgasse 5', response: ['Domgasse 5'], expected: true },
    { query: 'Domgasse 15', response: [], expected: false },
  ]) {
    it(`should return ${expected} for ${query} (fake)`, async () => {
      TestBed.configureTestingModule({
        providers: [provideAddressLookuperFake()],
      });
      const lookuper = TestBed.inject(AddressLookuper);
      const lookuperFake = TestBed.inject(AddressLookuperFake);
      lookuperFake.setResponseForQuery(query, expected);

      const validResource = TestBed.runInInjectionContext(() =>
        lookuper.lookup(() => query),
      );

      await wait();
      expect(validResource.status()).toBe('resolved');
      expect(validResource.value()).toBe(expected);
    });
  }
});
