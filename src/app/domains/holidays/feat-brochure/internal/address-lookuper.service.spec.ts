import { AddressLookuper } from './address-lookuper.service';
import { asyncScheduler, lastValueFrom, of, scheduled } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { createMock } from '@testing-library/angular/jest-utils';
import { TestBed } from '@angular/core/testing';

describe('Address Lookuper', () => {
  const setup = (httpClient?: unknown) => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClient ? httpClient : createMock(HttpClient),
        },
        AddressLookuper,
      ],
    });
    const lookuper = TestBed.inject(AddressLookuper);

    return { lookuper, httpClient } as {
      lookuper: AddressLookuper;
      httpClient: HttpClient;
    };
  };

  for (const { query, isValid } of [
    { query: 'Domgasse 5, 1010 Wien', isValid: true },
    { query: 'Domgasse 15, 1010 Wien', isValid: false },
  ]) {
    it(`should return ${isValid} for ${query}`, async () => {
      const addresses = ['Domgasse 5, 1010 Wien'];
      const httpClient = createMock(HttpClient);
      httpClient.get.mockReturnValue(scheduled([addresses], asyncScheduler));

      const { lookuper } = setup(httpClient);

      const promise = lastValueFrom(lookuper.lookup(query));
      expect(await promise).toBe(isValid);
    });
  }

  it('should use httpclient with right parameters', async () => {
    const httpClient = createMock(HttpClient);
    const { lookuper } = setup(httpClient);
    httpClient.get.mockReturnValue(of([]));

    lookuper.lookup('Domgasse 5');

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

  // it('should count the queries', () => {
  //   const lookuper = new AddressLookuper(() => []);
  //   expect(lookuper.counter).toBe(0);
  //   lookuper.lookup('Domgasse 5');
  //   expect(lookuper.counter).toBe(1);
  // });
});
