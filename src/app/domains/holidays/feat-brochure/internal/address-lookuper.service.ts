import { inject, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { parseAddress } from './parse-address';
import { isValidAddress } from './is-valid-address';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  #counter = 0;

  readonly #httpClient = inject(HttpClient);

  get counter(): number {
    return this.#counter;
  }

  lookup(queryFn: () => string) {
    return httpResource(
      () => {
        const query = queryFn();

        if (!isValidAddress(query)) {
          return undefined;
        }

        return {
          url: 'https://nominatim.openstreetmap.org/search.php',
          params: {
            format: 'jsonv2',
            q: query,
          },
        };
      },
      {
        parse(response) {
          return (response as unknown[]).length > 0;
        },
      },
    );
  }

  _lookup(query: string): Observable<boolean> {
    parseAddress(query);
    this.#counter++;
    return this.#httpClient
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
