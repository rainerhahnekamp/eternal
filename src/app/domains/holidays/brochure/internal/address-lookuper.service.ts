import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { z } from 'zod';

const addressResponseSchema = z.array(z.unknown());

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  lookup(query: () => string) {
    return httpResource(
      () => {
        if (!query()) {
          return undefined;
        }

        return {
          url: `https://nominatim.openstreetmap.org/search.php`,
          params: { format: 'jsonv2', q: query() },
        };
      },
      {
        parse: (response) => {
          const result = addressResponseSchema.safeParse(response);
          return result.success ? result.data.length > 0 : false;
        },
      },
    );
  }
}
