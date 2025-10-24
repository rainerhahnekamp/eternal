import { AddressLookuper } from './address-lookuper.service';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { AddressLookuperFake } from './address-lookuper-fake';

describe('Address Lookuper', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AddressLookuper, useExisting: AddressLookuperFake },
      ],
    });
    const lookuper = TestBed.inject(AddressLookuper);
    const lookuperFake = TestBed.inject(AddressLookuperFake);

    return { lookuper, lookuperFake };
  };

  const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const { response, isValid } of [
    { response: [], isValid: false },
    { response: ['Domgasse 5'], isValid: true },
  ]) {
    it(`return ${isValid} for ${response}`, async () => {
      const { lookuper, lookuperFake } = setup();
      const lookupResource = TestBed.runInInjectionContext(() =>
        lookuper.getLookupResource(() => 'Domgasse 5'),
      );

      lookuperFake.resolveToValueForNextCall(isValid);
      await wait();

      expect(lookupResource.hasValue()).toBe(true);
      expect(lookupResource.value()).toBe(isValid);
      expect(lookupResource.status()).toBe('resolved');
    });
  }

  // it('should ensure HttpClient is used correctly', async () => {
  //   const httpClient = {
  //     get: vitest.fn(
  //       (_url: string, _options: { params: Record<string, string> }) =>
  //         of([] as string[]),
  //     ),
  //   };
  //
  //   const lookuper = setup(assertType(httpClient));
  //   lookuper.lookup('Domgasse 5');
  //
  //   const [url, { params }] = httpClient.get.mock.calls[0];
  //
  //   expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
  //   expect(params).toEqual({ format: 'jsonv2', q: 'Domgasse 5' });
  // });

  // it('should count the queries', () => {
  //   setup([]);
  //   const lookuper = TestBed.inject(AddressLookuper);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse 5');
  //   expect(lookuper.counter).toBe(1);
  // });
});
