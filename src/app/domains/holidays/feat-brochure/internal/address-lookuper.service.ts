import { inject, Injectable, ResourceRef } from '@angular/core';
import { parseAddress } from './parse-address';
import { map, Observable } from 'rxjs';
import { HttpClient, httpResource } from '@angular/common/http';

export interface IAddressLookuper {
  getLookupResource(query: string): ResourceRef<boolean | undefined>;
  lookup(query: string): Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class AddressLookuper implements IAddressLookuper {
  #counter = 0;
  #httpClient = inject(HttpClient);

  get counter(): number {
    return this.#counter;
  }

  getLookupResource(query: string) {
    return httpResource(
      () => ({
        url: 'https://nominatim.openstreetmap.org/search.php',
        params: { q: query, format: 'jsonv2' },
      }),
      {
        parse: (response: unknown) => {
          if (Array.isArray(response)) {
            return response.length > 0;
          } else {
            return false;
          }
        },
      },
    );
  }

  lookup(query: string): Observable<boolean> {
    parseAddress(query);
    this.#counter++;
    return this.#httpClient
      .get<
        unknown[]
      >('https://nominatim.openstreetmap.org/search.php', { params: { format: 'jsonv2', q: query } })
      .pipe(map((response) => response.length > 0));
  }
}
