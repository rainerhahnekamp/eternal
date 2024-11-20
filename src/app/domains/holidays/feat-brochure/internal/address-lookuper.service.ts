import { inject, Injectable } from '@angular/core';
import { parseAddress } from './parse-address';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  #counter = 0;

  httpClient = inject(HttpClient);

  get counter(): number {
    return this.#counter;
  }

  lookup(query: string): Observable<boolean> {
    parseAddress(query);
    this.#counter++;
    return this.httpClient
      .get<string[]>('https://nominatim.openstreetmap.org/search.php', {
        params: new HttpParams().set('format', 'jsonv2').set('q', query),
      })
      .pipe(
        map((addresses) =>
          addresses.some((address) => address.includes(query)),
        ),
      );
  }
}
