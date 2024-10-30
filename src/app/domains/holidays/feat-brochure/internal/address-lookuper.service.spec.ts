import { expect } from '@jest/globals';
import { AddressLookuper } from './address-lookuper.service';
import { asyncScheduler, firstValueFrom, of, scheduled } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { createMock, Mock } from '@testing-library/angular/jest-utils';
import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/internal/testing/TestScheduler';

// function forQuery(query: string) {
//   const addresses = ['Domgasse 5, 1010 Wien'];
//   const lookuper = new AddressLookuper(() => addresses);
//   return {
//     shouldBeValid() {
//       expect(lookuper.lookup(query)).toBe(true);
//     },
//     shouldBeInvalid() {
//       expect(lookuper.lookup(query)).toBe(false);
//     },
//   };
// }

describe('Address Lookuper', () => {
  // it('should test Domgasse 5', () => {
  //   forQuery('Domgasse 5, 1010 Wien').shouldBeValid();
  // });
  //
  // it('should test Domgasse 15', () => {
  //   forQuery('Domgasse 15, 1010 Wien').shouldBeInvalid();
  // });

  const setup = (httpClient: unknown) => {
    return TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    }).inject(AddressLookuper);
  };

  for (const { query, isValid } of [
    { query: 'Domgasse 15, 1010 Wien', isValid: false },
    { query: 'Domgasse 5, 1010 Wien', isValid: true },
  ]) {
    it(`should be ${isValid} for ${query}`, async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(scheduled([addresses], asyncScheduler));

      const lookuper = setup(httpClient);

      const result = await firstValueFrom(lookuper.lookup(query));
      expect(result).toBe(isValid);
    });
  }

  it('should mock the HttpClient', async () => {
    const httpClient: Mock<HttpClient> = createMock(HttpClient);
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

  it('should use RxJs marbles', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    return testScheduler.run(({ cold, expectObservable }) => {
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(cold('(r|)', { r: [] }));
      const lookuper = setup(httpClient);

      expectObservable(lookuper.lookup('Domgasse 5')).toBe('(b|)', {
        b: false,
      });
    });
  });

  // it('should count the queries', () => {
  //   const lookuper = new AddressLookuper(() => []);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse 5');
  //   expect(lookuper.counter).toBe(1);
  // });
});
