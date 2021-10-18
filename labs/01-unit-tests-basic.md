- [1. Warm-Up](#1-warm-up)
- [2. Parsing address with multi-word city names](#2-parsing-address-with-multi-word-city-names)
- [3. Change the address-lookupers constructor](#3-change-the-address-lookupers-constructor)
- [4. Test Coverage](#4-test-coverage)
- [5. Bonus: Enforce Test Coverage Thresholds](#5-bonus-enforce-test-coverage-thresholds)
- [6: Bonus: Full Coverage](#6-bonus-full-coverage)

In this lab we will extend an existing service to verify addresses.

# 1. Warm-Up

Make sure your tests are running properly. Run `npm run test`. You should see the output of jest and all tests should succeed.

Make yourself acquainted with **shared/address-lookuper.service.spec.ts** and **shared/parse-address.spec.ts**. Don't forget to study the implementation as well and make sure you understand the code.

# 2. Parsing address with multi-word city names

The parser cannot parse city names with more than word. Like New York or Kuala Lumpur.

1. Start jest in watch mode. You can do that by `npx jest --watch` in the terminal or by `npm run test:watch`.

2. Open **shared/parse-address.spec.ts** and a new test that parses: "Domgasse 5, 2700 Wiener Neustadt". Let it fail first, then do the implementation.

**Hint**: The regex for the parser should be `/^(\w+)\s(\d+),\s(\d+)\s([\w\s]+)$/`

<details>
<summary>Show Solution</summary>
<p>

**shared/parse-address.spec.ts**

```typescript
it('should parse a city with multiple words', () => {
  expect(() => parseAddress('Domgasse 5, 2700 Wiener Neustadt')).to;
});
```

**shared/parse-adress.ts**

```typescript
export function parseAddress(query: string): Address {
  const shortPattern = /^([\w\s]+)\s(\d+)$/;
  const longPattern = /^([\w\s]+)\s(\d+),\s(\d+)\s([\w\s]+)$/; // <-- new regular expression
  ...
}
```

</p>
</details>

# 3. Change the address-lookupers constructor

Change the constructor of the `AddressLookuper` from a `string[]>` to a function that returns `string[]`.

Instead of `new AddressLookuper(["Domgasse 5, 1010 Wien"])`, it should be `new AddressLookuper(() => ["Domgasse 5, 1010 Wien"])`.

Following the TDD approach, change the unit tests **shared/addresss-lookuper.service.spec.ts** first, verify they fail and then continue with the implementation.

<details>
<summary>Show Solution</summary>
<p>

**shared/address-lookuper.service.spec.ts**

```typescript
describe('Address Lookuper', () => {
  it('should pass addresses in the constructor', () => {
    const addresses = () => ['Domgasse 15, 1010 Wien'];
    const lookuper = new AddressLookuper(addresses);

    expect(lookuper.lookup('Domgasse 5, 1010 Wien')).toBe(false);
    expect(lookuper.lookup('Domgasse 15, 1010 Wien')).toBe(true);
  });

  it('should work with short query input and long address store', () => {
    const addresses = () => ['Domgasse 15, 1010 Wien'];
    const lookuper = new AddressLookuper(addresses);

    expect(lookuper.lookup('Domgasse 15')).toBe(true);
  });

  it('should throw an error if no street number is given', () => {
    const lookuper = new AddressLookuper(() => []);

    expect(() => lookuper.lookup('Domgasse')).toThrowError(
      'Could not parse address. Invalid format.'
    );
  });
});
```

**shared/address-lookuper.service.ts**

```typescript
import { parseAddress } from './parse-address';

export class AddressLookuper {
  addresses: string[];

  constructor(addressesSupplier: () => string[]) {
    this.addresses = addressesSupplier();
  }

  lookup(query: string): boolean {
    parseAddress(query);
    return this.addresses.some((address) => address.startsWith(query));
  }
}
```

</p>
</details>

# 4. Test Coverage

Run Jest with enabled test coverage and check its output. At the moment it should be 100%.

```bash
npx jest --collect-coverage --coverage-reporter=html
```

Ensure that you have a coverage directory. Open the **lcov-report** report in **/coverage** and take a look at the **index.html**.

# 5. Bonus: Enforce Test Coverage Thresholds

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

# 6: Bonus: Full Coverage

Next to the `coverageThreshold` property in **/jest.config.ts**, add `collectCoverageFrom` with the value `['**/src/app/**']`. This time jest, should include all files in the coverage.
