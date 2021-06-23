export interface Address {
  street: string;
  streetNumber: string;
  zip?: string;
  city?: string;
}

export class AddressLookuper {
  constructor(private addresses: string[]) {}

  lookup(query: string): boolean {
    if (this.parse(query) === null) {
      throw new Error('Address without street number');
    }

    return this.addresses.some((address) => address.startsWith(query));
  }

  parse(query: string): Address | null {
    const shortPattern = /^([\w\s]+)\s(\d+)$/;
    const longPattern = /^([\w\s]+)\s(\d+),\s(\d+)\s(\w+)$/;
    let match: string[] | null = query.match(shortPattern);

    if (match) {
      return { street: match[1], streetNumber: match[2] };
    } else {
      match = query.match(longPattern);
      if (match) {
        return {
          street: match[1],
          streetNumber: match[2],
          zip: match[3],
          city: match[4]
        };
      }
    }

    return null;
  }
}
