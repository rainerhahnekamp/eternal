import { AddressLookuper, IAddressLookuper } from './address-lookuper.service';
import { Injectable, Provider, resource, ResourceRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AddressLookuperFake implements IAddressLookuper {
  #responses = {} as Record<string, boolean>;

  setResponseForQuery(query: string, response: boolean) {
    this.#responses[query] = response;
  }

  lookup(query: () => string): ResourceRef<boolean | undefined> {
    return resource({
      params: query,
      loader: ({ params: query }) => {
        const promise = new Promise<boolean>((resolve) => {
          if (query === undefined) {
            return undefined;
          }
          const response = this.#responses[query];

          if (response === undefined) {
            const msg = `AddressLookuper called with unknown query: ${query}`;
            console.error(msg);
            throw new Error(msg);
          }
          resolve(response);
        });

        return promise;
      },
    });
  }
}

export function provideAddressLookuperFake(): Provider {
  return { provide: AddressLookuper, useExisting: AddressLookuperFake };
}
