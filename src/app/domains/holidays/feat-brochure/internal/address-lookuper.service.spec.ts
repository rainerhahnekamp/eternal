import { expect } from '@jest/globals';
import { AddressLookuper } from './address-lookuper.service';
import { asyncScheduler, lastValueFrom, of, scheduled } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { createMock } from '@testing-library/angular/jest-utils';
import { TestBed } from '@angular/core/testing';

describe('Address Lookuper', () => {
  // HOMEWORK
  // beforeEach(() => {
  //   jest.useFakeTimers();
  // });
  //
  // afterEach(async () => {
  //   // await jest.runOnlyPendingTimersAsync();
  //   jest.useRealTimers();
  // });

  const setup = (httpClient: unknown) =>
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    }).inject(AddressLookuper);

  for (const { query, isValid } of [
    { query: 'Domgasse 15, 1010 Wien', isValid: false },
    { query: 'Domgasse 5, 1010 Wien', isValid: true },
  ]) {
    it(`should return ${isValid} for ${query}`, async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(scheduled([addresses], asyncScheduler));

      const lookuper = setup(httpClient);

      const outcome = await lastValueFrom(lookuper.lookup(query));

      expect(outcome).toBe(isValid);
    });
  }

  it('should use right parameters for HttpClient', async () => {
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
