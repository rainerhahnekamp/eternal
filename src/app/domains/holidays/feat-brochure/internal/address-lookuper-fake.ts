import { IAddressLookuper } from './address-lookuper.service';
import { Injectable, resource, ResourceRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AddressLookuperFake implements IAddressLookuper {
  #nextValue = undefined as boolean | undefined;

  resolveToValueForNextCall(value: boolean) {
    this.#nextValue = value;
  }

  getLookupResource(query: () => string): ResourceRef<boolean | undefined> {
    return resource({
      params: query,
      loader: () => {
        if (this.#nextValue === undefined) {
          console.error('no value available');
          throw new Error('no value avaiable');
        }

        return new Promise((resolve) => resolve(this.#nextValue as boolean));
      },
    });
  }
}
