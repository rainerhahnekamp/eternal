import { inject, Service } from '@angular/core';
import { parseAddress } from './parse-address';
import { ADDRESS_SUPPLIER } from './address-supplier';

@Service()
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
