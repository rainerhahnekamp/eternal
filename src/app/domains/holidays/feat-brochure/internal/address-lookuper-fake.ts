import { AddressLookuper, IAddressLookuper } from './address-lookuper.service';
import { Injectable, Provider, resource, ResourceRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AddressLookuperFake implements IAddressLookuper {
  #nextValue = undefined as boolean | undefined;

  resolveToValueForNextCall(value: boolean) {
    this.#nextValue = value;
  }

  lookup(query: () => string): ResourceRef<boolean | undefined> {
    return resource({
      params: query,
      loader: () => {
        const promise = new Promise<boolean>((resolve) => {
          if (this.#nextValue === undefined) {
            const msg = 'Fake as called without having a next value ready';
            console.error(msg);
            throw new Error(msg);
          }
          resolve(this.#nextValue);
        });

        this.#nextValue = undefined;
        return promise;
      },
    });
  }
}

export function provideAddressLookuperFake(): Provider {
  return { provide: AddressLookuper, useExisting: AddressLookuperFake };
}
