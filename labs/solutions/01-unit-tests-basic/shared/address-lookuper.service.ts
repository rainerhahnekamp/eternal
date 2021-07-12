import { parseAddress } from './parse-address';

export class AddressLookuper {
  addresses: string[] = [];

  constructor(addressesProvider: () => string[]) {
    this.addresses = addressesProvider();
  }

  lookup(query: string): boolean {
    if (!parseAddress(query)) {
      throw new Error('Address without street number');
    }

    return this.addresses.some((address) => address.startsWith(query));
  }

  /* istanbul ignore next */
  noob() {}
}
