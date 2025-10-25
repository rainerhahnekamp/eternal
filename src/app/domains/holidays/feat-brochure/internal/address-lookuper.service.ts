import { inject, Injectable, ResourceRef } from '@angular/core';
import { parseAddress } from './parse-address';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

export interface IAddressLookuper {
  getLookupResource(query: () => string): ResourceRef<boolean | undefined>;
}

@Injectable({ providedIn: 'root' })
export class NominatimService {
  #httpClient = inject(HttpClient);
  public query(q: string) {
    return this.#httpClient
      .get<
        unknown[]
      >('https://nominatim.openstreetmap.org/search.php', { params: { format: 'jsonv2', q } })
      .pipe(map((addresses) => addresses.length > 0));
  }
}

@Injectable({ providedIn: 'root' })
export class AddressLookuper implements IAddressLookuper {
  #counter = 0;
  #httpClient = inject(HttpClient);
  #nominatimService = inject(NominatimService);

  get counter(): number {
    return this.#counter;
  }

  // getLookupResource(query: () => string) {
  //   return httpResource(
  //     () => ({
  //       url: 'https://nominatim.openstreetmap.org/search.php',
  //       params: { format: 'jsonv2', q: query() },
  //     }),
  //     {
  //       parse: (response) => {
  //         if (Array.isArray(response)) {
  //           return response.length > 0;
  //         }
  //         return false;
  //       },
  //     },
  //   );
  // }

  getLookupResource(query: () => string) {
    return rxResource({
      params: () => {
        if (query() === '') {
          return undefined;
        }

        return query();
      },
      stream: ({ params }) => {
        return this.#nominatimService.query(params);
      },
    });
  }

  lookup(query: string): Observable<boolean> {
    parseAddress(query);
    this.#counter++;
    return this.#httpClient
      .get<
        unknown[]
      >('https://nominatim.openstreetmap.org/search.php', { params: { format: 'jsonv2', q: query } })
      .pipe(map((addresses) => addresses.length > 0));
  }
}
