import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { asyncScheduler, lastValueFrom, of, scheduled } from 'rxjs';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { createMock } from '@testing-library/angular/jest-utils';

describe('Address Lookuper', () => {
  const setup = (httpClientMock: HttpClient): AddressLookuper =>
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientMock }],
    }).inject(AddressLookuper);

  for (const { query, isValid } of [
    { query: 'Domgasse 15, 1010 Wien', isValid: false },
    { query: 'Domgasse 5, 1010 Wien', isValid: true },
  ]) {
    it(`should return ${isValid} for ${query}`, waitForAsync(async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];
      const httpClientStub = {
        get: () => scheduled([addresses], asyncScheduler),
      } as unknown as HttpClient;

      const lookuper = setup(httpClientStub);

      const value = await lastValueFrom(lookuper.lookup(query));
      expect(value).toBe(isValid);
    }));
  }

  it.skip('should verify that HttpClient is used with right parameters', waitForAsync(() => {
    const httpClientMock = createMock(HttpClient);
    httpClientMock.get.mockReturnValue(of([]));

    const lookuper = setup(httpClientMock);
    lookuper.lookup('Domgasse 5');

    const [url, options] = httpClientMock.get.mock.calls[0];
    expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
    expect(options.params).toEqual(
      new HttpParams().set('q', 'Domgasse 5').set('format', 'jsonv2'),
    );
  }));

  // it('should count the queries', () => {
  //   const lookuper = new AddressLookuper(() => []);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse');
  //   expect(lookuper.counter).toBe(1);
  // });
});
