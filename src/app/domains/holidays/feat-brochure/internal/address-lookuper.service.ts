import { Injectable, ResourceRef } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { z } from 'zod';

const responseSchema = z.array(z.unknown());

export interface IAddressLookuper {
  lookup(query: () => string): ResourceRef<boolean | undefined>;
}

@Injectable({ providedIn: 'root' })
export class AddressLookuper implements AddressLookuper {
  #counter = 0;

  get counter(): number {
    return this.#counter;
  }

  lookup(query: () => string): ResourceRef<boolean | undefined> {
    this.#counter++;

    return httpResource(
      () => {
        const q = query();
        if (q === '') {
          return undefined;
        }

        return {
          url: 'https://nominatim.openstreetmap.org/search.php',
          params: { format: 'jsonv2', q },
        };
      },
      {
        parse: (response: unknown) => {
          const addresses = responseSchema.parse(response);
          return addresses.length > 0;
        },
      },
    );
  }
}
