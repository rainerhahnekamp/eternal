import { inject, Injectable } from '@angular/core';
import { parseAddress } from './parse-address';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable()
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
        params: {
          format: 'jsonv2',
          q: query,
        },
      })
      .pipe(
        map((addresses) =>
          addresses.some((address) => address.includes(query)),
        ),
      );
  }
}
