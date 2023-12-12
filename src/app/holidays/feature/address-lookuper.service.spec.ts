import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { asyncScheduler, lastValueFrom, of, scheduled } from 'rxjs';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { marbles } from 'rxjs-marbles/jest';
import SpyInstance = jest.SpyInstance;

describe('Address Lookuper', () => {
  let lookuper: AddressLookuper;
  let spy: SpyInstance;

  beforeEach(() => {
    lookuper = TestBed.configureTestingModule({
      imports: [HttpClientModule],
    }).inject(AddressLookuper);

    spy = jest.spyOn(TestBed.inject(HttpClient), 'get');
  });

  const setup = (httpClient: unknown) => {
    return TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    }).inject(AddressLookuper);
  };

  for (const { query, isValid } of [
    { query: 'Domgasse 5', isValid: true },
    { query: 'Domgasse 15', isValid: false },
  ]) {
    it(`should return ${isValid} from ${query}`, waitForAsync(async () => {
      // const httpClient = createMock(HttpClient);
      const addresses = ['Domgasse 5, 1010 Wien'];

      spy.mockReturnValue(scheduled([addresses], asyncScheduler));
      // httpClient.get.mockReturnValue(scheduled([addresses], asyncScheduler));
      // const lookuper = setup(httpClient);

      expect(await lastValueFrom(lookuper.lookup(query))).toBe(isValid);
    }));
  }

  it('should use a mock for the HttpClient', waitForAsync(() => {
    // const httpClient = createMock(HttpClient);
    // httpClient.get.mockReturnValue(of([]));
    spy.mockReturnValue(of([]));

    // const lookuper = setup(httpClient);

    lookuper.lookup('Domgasse 5');
    expect(spy).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search.php',
      {
        params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5'),
      },
    );
  }));

  it(
    'should test with RxJs marbles',
    marbles((m) => {
      spy.mockReturnValue(m.cold('750ms r', { r: ['Domgasse 5'] }));
      m.expect(lookuper.lookup('Domgasse 5')).toBeObservable('750ms b', {
        b: true,
      });
    }),
  );

  // it('should count the queries', () => {
  //   const lookuper = new AddressLookuper(() => []);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse 5');
  //   expect(lookuper.counter).toBe(1);
  // });
});
