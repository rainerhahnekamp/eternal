import { Injectable } from '@angular/core';
import { parseAddress } from './parse-address';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  #counter = 0;
  constructor(public addressesSupplier: () => string[]) {}

  get counter(): number {
    return this.#counter;
  }

  lookup(query: string): boolean {
    parseAddress(query);
    this.#counter++;
    return this.addressesSupplier().some((address) => address.includes(query));
  }
}
