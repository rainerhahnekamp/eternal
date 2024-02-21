import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { asyncScheduler, lastValueFrom, Observable, of, scheduled } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { createMock } from '@testing-library/angular/jest-utils';
import * as http from 'http';

describe('Address Lookuper', () => {
  for (const { query, isValid } of [
    { query: 'Domgasse 5, 1010 Wien', isValid: true },
    { query: 'Domgasse 15, 1010 Wien', isValid: false },
  ]) {
    it(`should return ${isValid} for ${query}`, waitForAsync(async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];
      const httpClientStub = createMock(HttpClient);
      httpClientStub.get.mockReturnValue(
        scheduled([addresses], asyncScheduler).pipe(delay(0)),
      );
      TestBed.configureTestingModule({
        providers: [{ provide: HttpClient, useValue: httpClientStub }],
      });

      const lookuper = TestBed.inject(AddressLookuper);

      const result = await lastValueFrom(lookuper.lookup(query));
      expect(result).toBe(isValid);
    }));
  }

  it(`should use the HttpClient as a mock`, waitForAsync(() => {
    // ng-mocks
    // **testing-library
    // jasmine|jest-auto-spies
    // ts-mockito

    const httpClientMock = createMock(HttpClient);
    httpClientMock.get.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientMock }],
    });
    const lookuper = TestBed.inject(AddressLookuper);

    lookuper.lookup('Domgasse 5');

    const [url, options] = httpClientMock.get.mock.calls[0];

    expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
    expect(options.params).toEqual(
      new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5'),
    );
  }));

  // it('should count the queries', () => {
  //   const lookuper = new AddressLookuper(() => []);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse 5');
  //   expect(lookuper.counter).toBe(1);
  // });
});
