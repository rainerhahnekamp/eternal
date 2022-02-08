import { parseAddress } from './parse-address';

export class AddressLookuper {
  constructor(private addresses: string[]) {}

  lookup(query: string): boolean {
    parseAddress(query);
    return this.addresses.some((address) => address.startsWith(query));
  }

  // istanbul ignore next
  noop() {}
}
