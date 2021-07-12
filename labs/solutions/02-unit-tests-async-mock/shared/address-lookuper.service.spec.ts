import { HttpClient, HttpParams } from '@angular/common/http';
import { asyncScheduler, of, scheduled } from 'rxjs';
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

  it(`should have an assertive stub`, (done) => {
    const httpClientStub = mock<HttpClient>({
      get(url: string, options: { params: HttpParams }) {
        expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
        expect(options.params).toEqual(
          new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
        );

        return scheduled([['']], asyncScheduler);
      }
    });

    const lookuper = new AddressLookuper(httpClientStub);

    lookuper.lookup('Domgasse 5').subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });
});
