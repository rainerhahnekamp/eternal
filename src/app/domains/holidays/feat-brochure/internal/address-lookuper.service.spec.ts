import { TestBed } from '@angular/core/testing';
import { AddressLookuper } from './address-lookuper.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

describe('AddressLookuper', () => {
  for (const { isValid, addresses } of [
    { isValid: true, addresses: [{}] },
    { isValid: false, addresses: [] },
  ]) {
    it(`should return ${isValid} for ${addresses}`, async () => {
      // const clock = jasmine.clock().install();
      const mockHttpClient = {
        get: jasmine.createSpy().and.returnValue(of(addresses).pipe(delay(0))),
      };
      TestBed.configureTestingModule({
        providers: [{ provide: HttpClient, useValue: mockHttpClient }],
      });

      const service = TestBed.inject(AddressLookuper);

      let addressExists: boolean | undefined = undefined;

      service
        .lookup('Schillerstrasse 1')
        .subscribe((value) => (addressExists = value));

      await new Promise((resolve) => setTimeout(resolve));
      // Alternative
      // await Promise.resolve();
      // clock.tick(0);

      expect(addressExists as unknown as boolean).toBe(isValid);
      // clock.uninstall();
    });
  }

  it('should verify that the HTTP client is called with the correct URL and parameters', () => {
    const mockHttpClient = {
      get: jasmine.createSpy().and.returnValue(of([])),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: mockHttpClient }],
    });

    const service = TestBed.inject(AddressLookuper);
    service.lookup('Schillerstrasse 1');

    expect(mockHttpClient.get).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search.php',
      {
        params: {
          format: 'jsonv2',
          q: 'Schillerstrasse 1',
        },
      },
    );
  });

  it('should test with RxJS marble testing', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run(({ cold, expectObservable }) => {
      const httpClientMock = {
        get: jasmine.createSpy().and.returnValue(
          cold('500ms (a|)', {
            a: [{ name: 'Schillerstrasse 1' }],
          }),
        ),
      };

      TestBed.configureTestingModule({
        providers: [{ provide: HttpClient, useValue: httpClientMock }],
      });

      const service = TestBed.inject(AddressLookuper);
      const result$ = service.lookup('Schillerstrasse 1');
      expectObservable(result$).toBe('500ms (a|)', { a: true });
    });
  });
});
