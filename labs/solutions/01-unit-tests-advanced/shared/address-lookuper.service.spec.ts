import { HttpClient, HttpParams } from '@angular/common/http';
import { waitForAsync } from '@angular/core/testing';
import { createSpyFromClass } from 'jest-auto-spies';
import { asyncScheduler, Observable, of, scheduled } from 'rxjs';
import { AddressLookuper } from './address-lookuper.service';
import { assertType } from './assert-type';

describe('Address Lookuper', () => {
  for (let { response, expected } of [
    { response: [undefined], expected: true },
    { response: [], expected: false }
  ]) {
    it(
      `should return ${expected} for ${response}`,
      waitForAsync(() => {
        const httpClient = assertType<HttpClient>({
          get: () => scheduled([response], asyncScheduler)
        });
        const lookuper = new AddressLookuper(httpClient);

        lookuper.lookup('Domgasse 5').subscribe((isValid) => {
          expect(isValid).toBe(expected);
        });
      })
    );
  }

  it('should throw an error if no street number is given', () => {
    const lookuper = new AddressLookuper(assertType<HttpClient>());

    expect(() => lookuper.lookup('Domgasse')).toThrowError(
      'Could not parse address. Invalid format.'
    );
  });

  it('should call nominatim with right parameters', () => {
    const httpClient = { get: jest.fn() };
    httpClient.get.mockReturnValue(of([]));

    const lookuper = new AddressLookuper(assertType<HttpClient>(httpClient));
    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/search.php', {
      params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
    });
  });

  it(
    `should have an assertive stub`,
    waitForAsync(() => {
      const httpClientStub = assertType<HttpClient>({
        get(url: string, options: { params: HttpParams }) {
          expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
          expect(options.params).toEqual(
            new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
          );

          return scheduled([['']], asyncScheduler);
        }
      });

      const lookuper = new AddressLookuper(httpClientStub);

      lookuper.lookup('Domgasse 5').subscribe((result) => {
        expect(result).toBe(true);
      });
    })
  );

  it('should test http with jest-auto-spies', () => {
    const httpClient = createSpyFromClass(HttpClient);
    httpClient.get.mockReturnValue(of([]));

    const lookuper = new AddressLookuper(httpClient);
    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/search.php', {
      params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
    });
  });

  it('should call nominatim with right parameters, (mock property version)', () => {
    const httpClient = {
      get: jest.fn<Observable<undefined[]>, [string, { params: HttpParams }]>()
    };
    httpClient.get.mockReturnValue(of([]));
    const lookuper = new AddressLookuper(assertType<HttpClient>(httpClient));
    lookuper.lookup('Domgasse 5');

    const [url, { params }] = httpClient.get.mock.calls[0];
    expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
    expect(params).toEqual(new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5'));
  });
});
