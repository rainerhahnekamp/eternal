import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  inject,
  Injectable,
  Injector,
  Optional,
  SkipSelf,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  constructor(private httpClient: HttpClient) {}

  #counter = 0;

  get counter() {
    return this.#counter;
  }

  lookup(query: string): Observable<boolean> {
    this.#counter++;
    return this.httpClient
      .get<string[]>('https://nominatim.openstreetmap.org/search.php', {
        params: {
          q: query,
          format: 'jsonv2',
        },
      })
      .pipe(
        map((addresses) =>
          addresses.some((address) => address.startsWith(query)),
        ),
      );
  }
}
