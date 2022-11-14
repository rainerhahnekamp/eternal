import { parseAddress } from './parse-address';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  addresses: string[] = [];
  constructor(addressesSupplier: () => string[]) {
    this.addresses = addressesSupplier();
  }
  lookup(query: string): boolean {
    parseAddress(query);
    return this.addresses.some((address) => address.startsWith(query));
  }

  // istanbul ignore next
  noop() {}
}
