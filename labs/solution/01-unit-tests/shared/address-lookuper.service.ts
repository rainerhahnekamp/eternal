import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseAddress } from './parse-address';

export class AddressLookuper {
  constructor(private httpClient: HttpClient) {}

  lookup(query: string): Observable<boolean> {
    parseAddress(query);
    return this.httpClient
      .get<undefined[]>('https://nominatim.openstreetmap.org/search.php', {
        params: new HttpParams().set('format', 'jsonv2').set('q', query)
      })
      .pipe(map((response) => response.length > 0));
  }

  // istanbul ignore next
  noop() {}
}
