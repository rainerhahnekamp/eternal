import { parseAddress } from './parse-address';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  private httpClient = inject(HttpClient);

  lookup(query: string): Observable<boolean> {
    parseAddress(query);
    return this.httpClient
      .get<unknown[]>('https://nominatim.openstreetmap.org/search.php', {
        params: new HttpParams().set('format', 'jsonv2').set('q', query)
      })
      .pipe(map((response) => response.length > 0));
  }

  // istanbul ignore next
  noop() {}
}
