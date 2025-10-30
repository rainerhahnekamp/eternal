import { AddressLookuper } from './address-lookuper.service';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';
import {
  AddressLookuperFake,
  provideAddressLookuperFake,
} from './address-lookuper-fake';

export const wait = () => new Promise((resolve) => setTimeout(resolve));

describe('Address Lookuper', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const ctrl = TestBed.inject(HttpTestingController);
    const lookuper = TestBed.inject(AddressLookuper);

    return { ctrl, lookuper };
  };

  for (const { response, expected } of [
    { response: ['Domgasse 5, 1010 Wien'], expected: true },
    { response: [], expected: false },
  ]) {
    it(`return ${expected} for response ${response}`, async () => {
      const { ctrl, lookuper } = setup();

      const isValid = lastValueFrom(lookuper.lookup('Domgasse 5'));
      ctrl
        .expectOne(
          'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Domgasse%205',
        )
        .flush(response);

      expect(await isValid, `valid shoud be ${expected}`).toBe(expected);
    });

    it(`should use resource for ${expected} ${response}`, async () => {
      const { ctrl, lookuper } = setup();

      const res = TestBed.runInInjectionContext(() =>
        lookuper.getLookupResource('Domgasse 5'),
      );

      await wait();
      ctrl
        .expectOne(
          'https://nominatim.openstreetmap.org/search.php?q=Domgasse%205&format=jsonv2',
        )
        .flush(response);

      // await expect.poll(() => res.hasValue()).toBe(true);
      await expect.poll(() => res.value()).toBe(expected);
    });

    it.only(`should use fake for ${expected} ${response}`, async () => {
      TestBed.configureTestingModule({
        providers: [provideAddressLookuperFake()],
      });
      const lookuper = TestBed.inject(AddressLookuper);
      const fake = TestBed.inject(AddressLookuperFake);

      fake.resolveToValueForNextCall(expected);
      const res = TestBed.runInInjectionContext(() =>
        lookuper.getLookupResource('Domgasse 5'),
      );

      await expect.poll(() => res.value()).toBe(expected);
    });
  }
});
