import { TestBed } from '@angular/core/testing';
import { AddressLookuper } from './address-lookuper.service';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('Address Lookuper', () => {
  xit('should find an address via spy', async () => {
    const httpClient = {
      request: jasmine.createSpy(),
    };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: HttpClient,
          useValue: httpClient,
        },
      ],
    });
    const lookuper = TestBed.inject(AddressLookuper);

    const res = TestBed.runInInjectionContext(() =>
      lookuper.lookup(() => 'Domgasse 5'),
    );
    expect(res.status()).toBe('loading');
    await new Promise((resolve) => setTimeout(resolve));

    httpClient.request.and.returnValue(of([]).pipe(delay(0)));
    await new Promise((resolve) => setTimeout(resolve));

    expect(res.status()).toBe('resolved');
  });

  for (const { name, response, value } of [
    { name: 'find the address', response: [true], value: true },
    { name: 'find not the address', response: [], value: false },
  ]) {
    it(name, async () => {
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      });
      const lookuper = TestBed.inject(AddressLookuper);
      const ctrl = TestBed.inject(HttpTestingController);

      const res = TestBed.runInInjectionContext(() =>
        lookuper.lookup(() => 'Domgasse 5'),
      );
      expect(res.status()).toBe('loading');
      await new Promise((resolve) => setTimeout(resolve));

      ctrl
        .expectOne(
          'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Domgasse%205',
        )
        .flush(response);
      await new Promise((resolve) => setTimeout(resolve));

      expect(res.status()).toBe('resolved');
      expect(res.value()).toBe(value);
    });
  }
});
