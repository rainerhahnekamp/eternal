import { inject, Injectable } from '@angular/core';
import { parseAddress } from './parse-address';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  #addresses: string[] = [];

  httpClient = inject(HttpClient);

  constructor() {}

  #counter = 0;

  get counter() {
    return this.#counter;
  }

  lookup(query: string): Observable<boolean> {
    parseAddress(query);
    this.#counter++;
    return this.httpClient
      .get<unknown[]>('https://nominatim.openstreetmap.org/search.php', {
        params: new HttpParams().set('format', 'jsonv2').set('q', query),
      })
      .pipe(map((addresses) => addresses.length > 0));
  }
}
