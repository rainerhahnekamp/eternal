- [1. Warm-Up](#1-warm-up)
- [2. Our first test](#2-our-first-test)
- [3. Address Matching for Short Queries](#3-address-matching-for-short-queries)
- [4. Validate the Address format](#4-validate-the-address-format)
- [5. Bonus: Extract parser](#5-bonus-extract-parser)
- [6. Bonus: Test Coverage](#6-bonus-test-coverage)
- [7. Bonus: Enforce Test Coverage Thresholds](#7-bonus-enforce-test-coverage-thresholds)
- [8: Bonus: Full Coverage](#8-bonus-full-coverage)

In this lab we will add a service which verifies the existence of addresses. We will use TDD for that.

# 1. Warm-Up

Make sure your tests are running properly. Run `npm run test`. You should see the output of jest and all tests should succeed.

# 2. Our first test

You start with a test that instantiates a new class and passes a list of existing addresses in the constructor.

Create the file **shared/address-lookuper.service.spec.ts**. Add following code:

```typescript
import { AddressLookuper } from './address-lookuper.service';

describe('Address Lookuper', () => {
  it('should pass addresses in the constructor', () => {
    const addresses = () => ['Domgasse 15, 1010 Wien'];
    const lookuper = new AddressLookuper(addresses);

    expect(lookuper.lookup('Domgasse 5, 1010 Wien')).toBe(false);
    expect(lookuper.lookup('Domgasse 15, 1010 Wien')).toBe(true);
  });
});
```

Create the implementation in **shared/address-lookuper.service.ts**. Make the test turn green.

<details>
<summary>Show Solution</summary>
<p>

```typescript
export class AddressLookuper {
  addresses: string[];

  constructor(addressesSupplier: () => string[]) {
    this.addresses = addressesSupplier();
  }

  lookup(query: string): boolean {
    return this.addresses.some((address) => address === query);
  }
}
```

</p>
</details>

# 3. Address Matching for Short Queries

The AddressLookuper should also work, if the query only contains street and number.

Add the following test to **shared/address-lookuper.service.spec.ts**.

```typescript
it('should work with short query input and long address store', () => {
  const addresses = () => ['Domgasse 15, 1010 Wien'];
  const lookuper = new AddressLookuper(addresses);

  expect(lookuper.lookup('Domgasse 15')).toBe(true);
});
```

Implement the new feature.

<details>
<summary>Show Solution</summary>
<p>

```typescript
import { parseAddress } from './parse-address';

export class AddressLookuper {
  addresses: string[];

  constructor(addressesSupplier: () => string[]) {
    this.addresses = addressesSupplier();
  }

  lookup(query: string): boolean {
    return this.addresses.some((address) => address.startsWith(query));
  }
}
```

</p>
</details>

# 4. Validate the Address format

Add a test that checks if the query is in the right format. If not, it should throw an error with the message **Could not parse address. Invalid format.**.

You will need two regular expressions for that. One for the short and one for the long format:

1. Short: `/^([\w\s]+)\s(\d+)$/`
2. Long: `/^([\w\s]+)\s(\d+),\s(\d+)\s([\w\s]+)$/`

Add following test:

```typescript
it('should throw an error if no street number is given', () => {
  const lookuper = new AddressLookuper(() => []);

  expect(() => lookuper.lookup('Domgasse')).toThrowError(
    'Could not parse address. Invalid format.'
  );
});
```

<details>
<summary>Show Solution</summary>
<p>

```typescript
import { Address } from './address';

export class AddressLookuper {
  addresses: string[];

  constructor(addressesSupplier: () => string[]) {
    this.addresses = addressesSupplier();
  }

  lookup(query: string): boolean {
    this.parseAddress(query);
    return this.addresses.some((address) => address.startsWith(query));
  }

  parseAddress(query: string): Address {
    const shortPattern = /^([\w\s]+)\s(\d+)$/;
    const longPattern = /^([\w\s]+)\s(\d+),\s(\d+)\s([\w\s]+)$/;
    let match: string[] | null = query.match(shortPattern);

    if (match) {
      const [, street, streetNumber] = match;
      return { street, streetNumber };
    } else {
      match = query.match(longPattern);
      if (match) {
        const [, street, streetNumber, zip, city] = match;
        return { street, streetNumber, zip, city };
      }
    }

    throw new Error('Could not parse address. Invalid format.');
  }
}
```

</p>
</details>

# 5. Bonus: Extract parser

Extract the logic for parsing the address into an own file. Try to write tests for that as well.

You'll find the solution in the **solutions** subdirectory of this lab.

# 6. Bonus: Test Coverage

Run Jest with enabled test coverage and check its output. At the moment it should be 100%.

```bash
npx jest --collect-coverage --coverage-reporter=html
```

Ensure that you have a coverage directory. Open the **lcov-report** report in **/coverage** and take a look at the **index.html**.

# 7. Bonus: Enforce Test Coverage Thresholds

Enforce a global test coverage rate of 100%. Add some function to the address-lookuper and add the following configuration to **/jest.config.js**.

```js
module.exports = {
  // append this to the jest.config.js. Don't replace it
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
```

1. Run Jest with the collect coverage flag and make sure that it fails.
2. Add `/* istanbul ignore next*/` on top of the uncovered function, and re-run Jest. This time, it should not fail.

# 8: Bonus: Full Coverage

Next to the `coverageThreshold` property in **/jest.config.js**, add `collectCoverageFrom` with the value `['**/src/app/**']`. This time jest, should include all files in the coverage.
