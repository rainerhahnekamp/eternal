- [1. Setup](#1-setup)
- [2. Parsing address with multi-word city names](#2-parsing-address-with-multi-word-city-names)
- [3. Change the address-lookupers constructor](#3-change-the-address-lookupers-constructor)
- [4. Refactoring: Extracting Parser](#4-refactoring-extracting-parser)
- [5. Bonus: Test Coverage](#5-bonus-test-coverage)
- [6. Bonus: Enforce Test Coverage Thresholds](#6-bonus-enforce-test-coverage-thresholds)

In this lab we will extend an existing service to verify addresses.

# 1. Setup

Make sure your tests are running properly. Run `npm run test`. You should see the output of jest and all tests should succeed.

Make yourself acquainted with **shared/address-lookuper.service.spec.ts** and **shared/parse-address.spec.ts**. Don't forget to study the implementation as well and make sure you understand the code.

# 2. Parsing address with multi-word city names

The parser is not able to parse cities that have a name which consist of more than word, e.g. New York or Kuala Lumpur. We'll fix that.

1. Start jest in watch mode. You can do that by `npx jest --watch` in the terminal or by `npm run test:watch`.

2. Open **shared/address-lookuper.service.spec.ts** and a new test that "Domgasse 5, 2700 Wiener Neustadt" returns "Wiener Neustadt" as city name for the method `parse`. Write the test first, verify it fails and then do the implementation.

**Hint**: The regex for the parser should be `/^(\w+)\s(\d+),\s(\d+)\s([\w\s]+)$/`

# 3. Change the address-lookupers constructor

The lookuper service will fetch the address from a Geo service. So we should change the constructor's argument from an array to a function that returns the array.

Instead of `new AddressLookuper(["Domgasse 5, 1010 Wien"])`, it should be `new AddressLookuper(() => ["Domgasse 5, 1010 Wien"])`.

Following the TDD approach, first change the unit tests in **shared/addresss-lookuper.service.spec.ts**, verify they fail and only then fix the implementation.

# 4. Refactoring: Extracting Parser

By looking at the service, we realise that the `parse` function is a dependency for the actual lookup. We want to extract the parser and its test into an own file. We would end up having a **shared/parse-address.ts** and a **shared/parse-address.spec.ts**.

We should also extract the `Address` interface into its own file. Parser and Lookup depend on it.

We end up having two small units with clear responsibilities and test coverage.

<details>
<summary>Show Solution</summary>

<p>The files are located in the <strong>./solutions/01-unit-tests-basics</strong> directory.</p>

</details>

# 5. Bonus: Test Coverage

Run Jest with enabled test coverage and check its output. At the moment it should be 100%.

```bash
npx jest --collect-coverage --coverage-reporter=html
```

Ensure that you have a coverage directory. Open the **lcov-report** report in **/coverage** and take a look at the **index.html**.

# 6. Bonus: Enforce Test Coverage Thresholds

Require a global test coverage rate of 100%. Add some function to the address-lookuper and add the following configuration to **/jest.config.js**.

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
3. Next to the `coverageThreshold` property in **/jest.config.ts**, add `collectCoverageFrom` with the value `['**/src/app/**']`. This time jest, should include all files in the coverage.
