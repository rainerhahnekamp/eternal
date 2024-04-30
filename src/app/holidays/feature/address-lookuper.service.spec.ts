import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { asyncScheduler, lastValueFrom, of, scheduled, take } from 'rxjs';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClient,
  HttpClientModule,
  HttpParams,
  provideHttpClient,
} from '@angular/common/http';
import { createMock } from '@testing-library/angular/jest-utils';
import { marbles } from 'rxjs-marbles/jest';
import { delay, map } from 'rxjs/operators';
import * as http from 'node:http';

describe('Address Lookuper', () => {
  const setup = (httpClient: unknown) =>
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    }).inject(AddressLookuper);

  for (const { query, isValid } of [
    { query: 'Domgasse 5, 1010 Wien', isValid: true },
    { query: 'Domgasse 15, 1010 Wien', isValid: false },
  ]) {
    it(`should return ${isValid} for ${query}`, waitForAsync(async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(scheduled([addresses], asyncScheduler));
      const lookuper = setup(httpClient);
      expect(await lastValueFrom(lookuper.lookup(query))).toBe(isValid);
    }));
  }

  it('should verify that right parameters are used', waitForAsync(() => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(of([]));

    const lookuper = setup(httpClient);
    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search.php',
      {
        params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5'),
      },
    );
  }));

  it('should count the queries', waitForAsync(async () => {
    const httpClient = {
      get: jest.fn(),
    };
    httpClient.get.mockReturnValue(of([]));
    const lookuper = setup(httpClient);
    expect(lookuper.counter).toBe(0);
    await lastValueFrom(lookuper.lookup('Domgasse 5'));
    expect(lookuper.counter).toBe(1);
  }));

  it(
    'should apply RxJs Marbles to AddressLookuper',
    marbles((m) => {
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(
        m.cold('750ms (r|)', { r: ['Domgasse 5'] }),
      );
      const lookuper = setup(httpClient);
      m.expect(lookuper.lookup('Domgasse 5')).toBeObservable('750ms (b|)', {
        b: true,
      });
    }),
  );

  it(
    'should use RxJs Marbles',
    marbles((m) => {
      const numbers$ = m.cold('a 1s b 500ms c', { a: 1, b: 2, c: 3 });
      const result$ = numbers$.pipe(
        map((n) => n * 2),
        delay(100),
        take(3),
      );
      m.expect(result$).toBeObservable('100ms x 1s y 500ms (z|)', {
        x: 2,
        y: 4,
        z: 6,
      });
    }),
  );
});
