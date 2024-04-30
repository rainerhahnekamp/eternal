import { Host, inject, Injectable, Optional, SkipSelf } from '@angular/core';
import { parseAddress } from './parse-address';
import { HttpClient, HttpParams } from '@angular/common/http';
import { debounceTime, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  httpClient = inject(HttpClient);

  #counter = 0;

  get counter() {
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
        debounceTime(250),
        map((addresses) =>
          addresses.some((address) => address.startsWith(query)),
        ),
      );
  }
}
