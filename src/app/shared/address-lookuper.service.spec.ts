import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { asyncScheduler, lastValueFrom, of, scheduled } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { assertType } from '@app/assert-type';
import { createMock } from '@testing-library/angular/jest-utils';

describe('Address Lookuper', () => {
  const setup = (httpClient: HttpClient) =>
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    }).inject(AddressLookuper);

  for (const { query, isValid } of [
    { query: 'Domgasse 15, 1010 Wien', isValid: false },
    { query: 'Domgasse 5, 1010 Wien', isValid: true },
  ]) {
    it(`should return ${isValid} for ${query}`, waitForAsync(async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];
      const httpClientStub = assertType<HttpClient>({
        get: () => scheduled([addresses], asyncScheduler),
      });
      const lookuper = setup(httpClientStub);

      expect(await lastValueFrom(lookuper.lookup(query))).toBe(isValid);
    }));
  }

  it('should verify that the right parameters are being called', waitForAsync(() => {
    const httpClientMock = createMock(HttpClient);
    httpClientMock.get.mockReturnValue(of([]));

    const lookuper = setup(httpClientMock);
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
  //   lookuper.lookup('Domgasse');
  //   expect(lookuper.counter).toBe(1);
  // });
});
