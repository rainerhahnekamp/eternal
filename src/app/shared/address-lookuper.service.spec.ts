import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { createMock } from '@testing-library/angular/jest-utils';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { asyncScheduler, lastValueFrom, Observable, scheduled } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as http from 'node:http';
import { assertType } from '@app/shared/assert-type';
import { marbles } from 'rxjs-marbles/jest';

describe('Address Lookuper', () => {
  for (const { query, result } of [
    { query: 'Domgasse 15, 1010 Wien', result: false },
    { query: 'Domgasse 5, 1010 Wien', result: true },
  ]) {
    it(`should return ${result} for ${query}`, waitForAsync(async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];

      const httpClient = {
        get() {
          return scheduled([addresses], asyncScheduler);
        },
      };

      TestBed.configureTestingModule({
        providers: [{ provide: HttpClient, useValue: httpClient }],
      });
      const lookuper = TestBed.inject(AddressLookuper);
      const isValid = await lastValueFrom(lookuper.lookup(query));

      expect(isValid).toBe(result);
    }));
  }

  for (const { query, result } of [
    { query: 'Domgasse 15, 1010 Wien', result: false },
    { query: 'Domgasse 5, 1010 Wien', result: true },
  ]) {
    it(`should return ${result} for ${query} without lastValueFrom`, waitForAsync(() => {
      const addresses = ['Domgasse 5, 1010 Wien'];

      const httpClient = {
        get() {
          return scheduled([addresses], asyncScheduler);
        },
      };

      TestBed.configureTestingModule({
        providers: [{ provide: HttpClient, useValue: httpClient }],
      });
      const lookuper = TestBed.inject(AddressLookuper);
      lookuper
        .lookup(query)
        .subscribe((isValid) => expect(isValid).toBe(result));
    }));
  }

  for (const { query, result } of [
    { query: 'Domgasse 15, 1010 Wien', result: false },
    { query: 'Domgasse 5, 1010 Wien', result: true },
  ]) {
    it(`should return ${result} for ${query} with fakeAsync`, fakeAsync(() => {
      const addresses = ['Domgasse 5, 1010 Wien'];

      const httpClient = {
        get() {
          return scheduled([addresses], asyncScheduler);
        },
      };

      TestBed.configureTestingModule({
        providers: [{ provide: HttpClient, useValue: httpClient }],
      });
      const lookuper = TestBed.inject(AddressLookuper);
      lookuper
        .lookup(query)
        .subscribe((isValid) => expect(isValid).toBe(result));
      tick();
    }));
  }

  it('should call the right url', waitForAsync(() => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(scheduled([[]], asyncScheduler));

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    });
    const lookuper = TestBed.inject(AddressLookuper);
    lookuper.lookup('Domgasse 5');

    const [url, { params }] = httpClient.get.mock.calls[0];

    expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
    expect(params).toEqual({
      q: 'Domgasse 5',
      format: 'jsonv2',
    });
  }));

  it(
    'should use marble testing',
    marbles((m) => {
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(m.cold('250ms r', { r: [] }));

      const lookuper = TestBed.configureTestingModule({
        providers: [
          {
            provide: HttpClient,
            useValue: httpClient,
          },
        ],
      }).inject(AddressLookuper);

      m.expect(lookuper.lookup('Domgasse 5')).toBeObservable('250ms b', {
        b: false,
      });
    }),
  );

  // it('should count the queries', () => {
  //   const lookuper = new AddressLookuper(() => []);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse');
  //   expect(lookuper.counter).toBe(1);
  // });
});
