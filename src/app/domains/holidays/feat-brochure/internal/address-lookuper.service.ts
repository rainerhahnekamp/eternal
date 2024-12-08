import { Injectable } from '@angular/core';
import { parseAddress } from './parse-address';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  #addresses: string[] = [];
  constructor(addressSupplier: () => string[]) {
    this.#addresses = addressSupplier();
  }
  #counter = 0;

  get counter() {
    return this.#counter;
  }

  lookup(query: string): boolean {
    parseAddress(query);
    this.#counter++;
    return this.#addresses.some((address) => address.startsWith(query));
  }
}
