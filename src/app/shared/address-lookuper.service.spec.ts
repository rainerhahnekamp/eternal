import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { asyncScheduler, lastValueFrom, of, scheduled } from 'rxjs';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClient,
  HttpClientModule,
  HttpParams,
  provideHttpClient,
} from '@angular/common/http';
import { createMock } from '@testing-library/angular/jest-utils';
import { marbles } from "rxjs-marbles/jest";

describe('Address Lookuper', () => {
  for (const { query, isValid } of [
    {
      query: 'Domgasse 5, 1010 Wien',
      isValid: true,
    },
    { query: 'Domgasse 15, 1010 Wien', isValid: false },
  ]) {
    it(`should return ${isValid} for ${query}`, waitForAsync(async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];
      // const httpClient = {get: () => of(addresses).pipe(delay(0))}
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(scheduled([addresses], asyncScheduler));

      const lookuper = TestBed.configureTestingModule({
        providers: [{ provide: HttpClient, useValue: httpClient }],
      }).inject(AddressLookuper);

      expect(await lastValueFrom(lookuper.lookup(query))).toBe(isValid);
    }));
  }

  it('should check the HttpClient', waitForAsync(() => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(of([]));

    const lookuper = TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    }).inject(AddressLookuper);
    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search.php',
      {
        params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5'),
      },
    );
  }));

  it('should use RxJs Marbles', marbles((m) => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(m.cold('750ms (a|)', {a: ['Domgasse 5']}));

    const lookuper = TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    }).inject(AddressLookuper);

    m.expect(lookuper.lookup('Domgasse 5')).toBeObservable('1s (b|)', {b: true})
  }));

  // it('should count the queries', () => {
  //   const lookuper = new AddressLookuper(() => []);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse');
  //   expect(lookuper.counter).toBe(1);
  // });
});
