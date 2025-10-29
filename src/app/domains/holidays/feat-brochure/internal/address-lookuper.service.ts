import { inject, Injectable } from '@angular/core';
import { parseAddress } from './parse-address';
import { ADDRESS_SUPPLIER } from './address-supplier';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  #counter = 0;
  #addressesSupplier = inject(ADDRESS_SUPPLIER);

  get counter(): number {
    return this.#counter;
  }

  lookup(query: string): boolean {
    parseAddress(query);
    this.#counter++;
    return this.#addressesSupplier.some((address) => address.includes(query));
  }
}
