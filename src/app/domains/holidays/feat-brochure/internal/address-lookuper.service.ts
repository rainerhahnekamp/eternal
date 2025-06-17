import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { z } from 'zod';
import { map, Observable } from 'rxjs';

const addressResponseSchema = z.array(z.unknown());

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  readonly #httpClient = inject(HttpClient);

  lookup(query: string): Observable<boolean> {
    return this.#httpClient
      .get<unknown[]>(`https://nominatim.openstreetmap.org/search.php`, {
        params: {
          format: 'jsonv2',
          q: query,
        },
      })
      .pipe(map((addresses) => addresses.length > 0));
  }
}
