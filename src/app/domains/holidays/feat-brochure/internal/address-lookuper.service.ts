import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { parseAddress } from './parse-address';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  #counter = 0;
  #httpClient = inject(HttpClient);

  get counter(): number {
    return this.#counter;
  }

  lookup(query: string): Observable<boolean> {
    parseAddress(query);
    this.#counter++;

    return this.#httpClient
      .get<
        unknown[]
      >('https://nominatim.openstreetmap.org/search.php', { params: { q: query, format: 'jsonv2' } })
      .pipe(map((addresses) => addresses.length > 0));
  }
}
