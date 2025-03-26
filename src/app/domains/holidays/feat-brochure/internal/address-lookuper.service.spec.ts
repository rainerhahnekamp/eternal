import { AddressLookuper } from './address-lookuper.service';
import { asyncScheduler, of, scheduled } from 'rxjs';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

function assertType<T>(object: unknown): T {
  return object as T;
}

describe('Address Lookuper', () => {
  const setup = (httpClient: unknown) => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    });
    return TestBed.inject(AddressLookuper);
  };

  for (const { query, isValid } of [
    { query: 'Domgasse 15, 1010 Wien', isValid: false },
    { query: 'Domgasse 5, 1010 Wien', isValid: true },
  ]) {
    it(`should return ${isValid} on ${query}`, async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(scheduled([addresses], asyncScheduler));

      const lookuper = setup(httpClient);

      // const result = await firstValueFrom(lookuper.lookup(() => query));
      // expect(result).toBe(isValid);
    });
  }

  it('should use right parameters', async () => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(of([] as string[]));

    const lookuper = setup(httpClient);
    lookuper.lookup(() => 'Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search.php',
      {
        params: {
          format: 'jsonv2',
          q: 'Domgasse 5',
        },
      },
    );
  });

  it.only('should use right parameters', async () => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const ctrl = TestBed.inject(HttpTestingController);
    const lookuper = TestBed.inject(AddressLookuper);

    const res = TestBed.runInInjectionContext(() =>
      lookuper.lookup(() => 'Domgasse 5'),
    );
    await jest.runAllTimersAsync();
    ctrl.expectOne(
      'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Domgasse%205',
    ).flush([ ])

    await jest.runAllTimersAsync();
    expect(res.hasValue()).toBe(true)
    expect(res.value()).toBe(false)
    jest.useRealTimers();
  });

  it('should count the queries', () => {
    const httpClient = createMock(HttpClient);
    httpClient.get.mockReturnValue(of([]));
    const lookuper = setup(httpClient);
    expect(lookuper.counter).toBe(0);
    lookuper.lookup(() => 'Domgasse 5');
    expect(lookuper.counter).toBe(1);
  });
});
