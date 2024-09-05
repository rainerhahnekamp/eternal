import { AddressLookuper } from './address-lookuper.service';
import { expect } from '@jest/globals';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  asyncScheduler,
  firstValueFrom,
  Observable,
  of,
  scheduled,
} from 'rxjs';
import {
  HttpClient,
  HttpParams,
  provideHttpClient,
} from '@angular/common/http';
import { createMock } from '@testing-library/angular/jest-utils';

describe('Address Lookuper', () => {
  let lookuper: AddressLookuper;

  const setup = (httpClient: unknown) => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClient }],
    });
    return TestBed.inject(AddressLookuper);
  };

  it('should has a valid address', waitForAsync(async () => {
    const httpClientStub = createMock(HttpClient);
    const lookuper = setup(httpClientStub);
    httpClientStub.get.mockReturnValue(
      scheduled([['Domgasse 5']], asyncScheduler),
    );

    const addressExists = firstValueFrom(lookuper.lookup('Domgasse 10'));
    expect(await addressExists).toBe(false);
  }));

  it('should use the right URL', waitForAsync(() => {
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
  }));

  it('should use the HttpClient', waitForAsync(async () => {
    const lookuper = TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    }).inject(AddressLookuper);
    const addressExists = firstValueFrom(lookuper.lookup('Domgasse 10'));
    expect(await addressExists).toBe(false);
  }));
});
