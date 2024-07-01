export class AddressLookuper {
  #addresses: string[];

  constructor(addressSupplier: () => string[]) {
    this.#addresses = addressSupplier();
  }
  #counter = 0;

  get counter() {
    return this.#counter;
  }

  lookup(query: string): boolean {
    this.#counter++;
    return this.#addresses.some((address) => address.startsWith(query));
  }
}
