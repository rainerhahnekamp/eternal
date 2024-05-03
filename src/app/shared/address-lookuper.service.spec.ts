import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { asyncScheduler, first, lastValueFrom, of, scheduled, take } from "rxjs";
import {
  HttpClient,
  HttpParams,
  provideHttpClient,
} from '@angular/common/http';
import { ht } from 'date-fns/locale';
import { createMock } from '@testing-library/angular/jest-utils';
import { marbles } from 'rxjs-marbles/jest';
import { delay, filter, map } from 'rxjs/operators';

describe('Address Lookuper', () => {
  for (const { query, isValid } of [
    { query: 'Domgasse 5, 1010 Wien', isValid: true },
    {
      query: 'Domgasse 15, 1010 Wien',
      isValid: false,
    },
  ]) {
    it(`should return ${isValid} for ${query}`, waitForAsync(async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(scheduled([addresses], asyncScheduler));

      TestBed.configureTestingModule({
        providers: [{ provide: HttpClient, useValue: httpClient }],
      });
      const lookuper = TestBed.inject(AddressLookuper);

      expect(await lastValueFrom(lookuper.lookup(query))).toBe(isValid);
    }));
  }

  it('should verify the HttpClient has been called', waitForAsync(() => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    });

    const lookuper = TestBed.inject(AddressLookuper);

    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search.php',
      {
        params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5'),
      },
    );
  }));

  it(
    'should test with RxJs Marbles',
    marbles((m) => {
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(m.cold('750ms (r|)', { r: ['Domgasse 5'] }));

      TestBed.configureTestingModule({
        providers: [{ provide: HttpClient, useValue: httpClient }],
      });

      const lookuper = TestBed.inject(AddressLookuper);

      m.expect(lookuper.lookup('Domgasse 5')).toBeObservable('750ms (b|)', {
        b: true,
      });
    }),
  );

  /**
   * Anwendungsfälle
   *
   * 1. Observables mit mehreren Werten
   * 2. Observable mit vielen/komplizierten Pipe Operatoren
   * 3. Eigene Operatoren
   */
  it(
    'should test an Observable',
    marbles((m) => {
      const numbers$ = m.cold('1s a 1s b 500ms c', { a: 1, b: 2, c: 3 });
      const destination$ = numbers$.pipe(
        delay(2000),
        map((n) => n * 2),
        filter((n) => n > 3),
      );
      m.expect(destination$).toBeObservable('4s 1ms y 500ms z', {
        x: 2,
        y: 4,
        z: 6,
      });
    }),
  );

  it('should test first operator', marbles((m) => {
    const numbers$ = m.cold('1s |', { a: 1});
    const destination$ = numbers$.pipe(
      take(1)
    );
    m.expect(destination$).toBeObservable('1s |', {
      a: 1
    });
  }))

  // it('should count the queries', () => {
  //   const lookuper = new AddressLookuper(() => []);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse');
  //   expect(lookuper.counter).toBe(1);
  // });
});
