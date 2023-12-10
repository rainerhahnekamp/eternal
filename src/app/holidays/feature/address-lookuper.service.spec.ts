import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  asyncScheduler,
  firstValueFrom,
  Observable,
  of,
  scheduled,
} from 'rxjs';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { assertType } from './assert-type';
import { createMock } from '@testing-library/angular/jest-utils';

describe('Address Lookuper', () => {
  const setup = (httpClient: HttpClient): AddressLookuper =>
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClient,
        },
      ],
    }).inject(AddressLookuper);

  for (const { query, expected, response } of [
    { query: 'Domgasse 5', response: ['Domgasse 5'], expected: true },
    { query: 'Domgasse 15', response: [], expected: false },
  ]) {
    it(`should return ${expected} for ${query}`, fakeAsync(() => {
      const httpClient = assertType<HttpClient>({
        get: () => scheduled([response], asyncScheduler),
      });
      const lookuper = setup(httpClient);

      lookuper.lookup(query).subscribe((isValid) => {
        expect(isValid).toBe(expected);
      });

      tick();
    }));
  }

  it('should call nominatim with right parameters', () => {
    const httpClient = { get: jest.fn() };
    httpClient.get.mockReturnValue(of([]));

    const lookuper = setup(assertType<HttpClient>(httpClient));
    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search.php',
      {
        params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5'),
      }
    );
  });

  it(`should have an assertive stub`, async () => {
    const httpClientStub = assertType<HttpClient>({
      get(url: string, options: { params: HttpParams }) {
        expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
        expect(options.params).toEqual(
          new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
        );

        return scheduled([['']], asyncScheduler);
      },
    });

    const lookuper = setup(httpClientStub);
    const result = await firstValueFrom(lookuper.lookup('Domgasse 5'));

    expect(result).toBe(true);
  });

  it('should test http with createMock', () => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(of([]));

    const lookuper = setup(httpClient);
    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search.php',
      {
        params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5'),
      }
    );
  });

  it('should call nominatim with right parameters, (mock property version)', () => {
    const httpClient = {
      get: jest.fn<Observable<undefined[]>, [string, { params: HttpParams }]>(),
    };
    httpClient.get.mockReturnValue(of([]));
    const lookuper = setup(assertType<HttpClient>(httpClient));
    lookuper.lookup('Domgasse 5');

    const [url, { params }] = httpClient.get.mock.calls[0];
    expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
    expect(params).toEqual(
      new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
    );
  });

  it('should count the queries', () => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(of([]));

    const lookuper = setup(httpClient);
    expect(lookuper.counter).toBe(0);
    lookuper.lookup('Domgasse 5');
    expect(lookuper.counter).toBe(1);
  });
});
