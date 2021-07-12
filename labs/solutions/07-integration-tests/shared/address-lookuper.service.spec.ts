import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { asyncScheduler, of, scheduled } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { AddressLookuper } from './address-lookuper.service';
import { mock } from './mock';
import DoneCallback = jest.DoneCallback;

describe('Address Lookuper', () => {
  it.each<any>([
    [true, ['a']],
    [true, [false, null, 0]],
    [false, []]
  ])(`should return %s for %s`, (expected: boolean, response: string[], done: DoneCallback) => {
    const httpClient = mock<HttpClient>({ get: () => scheduled([response], asyncScheduler) });
    const lookuper = new AddressLookuper(httpClient);
    lookuper.lookup('Domgasse 5').subscribe((isValid) => {
      expect(isValid).toBe(expected);
      done();
    });
  });

  it('should call nominatim with right parameters', () => {
    const httpClient = { get: jest.fn((url: string, options: { params: HttpParams }) => of([])) };
    const lookuper = new AddressLookuper(mock<HttpClient>(httpClient));

    lookuper.lookup('Domgasse 5');

    expect(httpClient.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/search.php', {
      params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
    });
  });

  it('should throw an error if no street number is given', () => {
    const lookuper = new AddressLookuper(mock<HttpClient>(null));

    expect(() => lookuper.lookup('Domgasse')).toThrowError('Address without street number');
  });

  it(
    'should use rxjs-marbles',
    marbles((m) => {
      const httpClient = {
        get: () => m.cold('150ms r', { r: [true] })
      };
      const lookuper = new AddressLookuper((httpClient as unknown) as HttpClient);
      const isValid$ = lookuper.lookup('Domgasse 5');
      m.expect(isValid$).toBeObservable('150ms t', { t: true });
    })
  );

  it('should do a real request', (done) => {
    const lookuper = TestBed.configureTestingModule({ imports: [HttpClientModule] }).inject(
      AddressLookuper
    );
    lookuper.lookup('Domgasse 5').subscribe((isValid) => {
      expect(isValid).toBe(true);
      done();
    });
  });
});
