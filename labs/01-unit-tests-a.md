# Angular Workshop: Testing / Unit Tests

- [Angular Workshop: Testing / Unit Tests](#angular-workshop-testing--unit-tests)
  - [Sanity Test](#sanity-test)
  - [Lookup Method](#lookup-method)
  - [Dummy Data](#dummy-data)
  - [Basic Validation](#basic-validation)
  - [The Need for a Parser](#the-need-for-a-parser)
  - [Support for German Address Format](#support-for-german-address-format)
  - [Provide DataSet for Addresses](#provide-dataset-for-addresses)
  - [Dealing with sort and long notation](#dealing-with-sort-and-long-notation)
  - [Address DataSet as function](#address-dataset-as-function)
  - [Bonus: Be Creative](#bonus-be-creative)

In this lab, you will write basic Unit Tests in a TDD-style. Only the code for the tests will be provided. You have to come up with the actual implementation.

We have the general requirement to verify the address our customers type in.

## Sanity Test

First of all, we need to make sure that we have a class that will do the lookup.

File: `address-lookuper.spec.ts`

```typescript
describe('Address Lookuper', () => {
  it('should instantiate the lookuper', () => {
    const lookuper = new AddressLookuper();
    expect(lookuper).toBeDefined();
  });
});
```

Start jest in watch mode, make sure the test runs and fails. Then make it turn green.

## Lookup Method

Just having a class will not be enough. We also require a lookup method that returns us a boolean when call it.

Add following test to the existing test suite:

```typescript
it.skip('should provide a lookup method', () => {
  const lookuper = new AddressLookuper();
  const result = lookuper.lookup('');

  expect(result).toBe(true);
});
```

## Dummy Data

The next step is that we want to make sure that it dosn't always return true. So it should only return true, if the address to lookup is only **Domgasse 5**.

```typescript
it('should return true on Domgasse 5', () => {
  const lookuper = new AddressLookuper();
  const result = lookuper.lookup('Domgasse 5');
  expect(result).toBe(true);
});

it('should return false on Domgasse 15', () => {
  const lookuper = new AddressLookuper();
  const result = lookuper.lookup('Domgasse 15');
  expect(result).toBe(false);
});
```

At this stage, the former test will fail. You will probably not need it.

## Basic Validation

We need to make sure that we get at least a street and its number to search for. Otherwise an error should be thrown.

```typescript
it('should throw an error if no street number is given', () => {
  const lookuper = new AddressLookuper();

  expect(() => lookuper.lookup('Domgasse')).toThrow('Address without street number');
});
```

## The Need for a Parser

We realise that we have to think a little more about validation and come up with the idea of a parser.

```typescript
it('should provide a parse method', () => {
  const lookuper = new AddressLookuper();
  const address = lookuper.parse('Domgasse 5');
  expect(address).toEqual({ street: 'Domgasse', streetNumber: '5' });
});
```

\* Hint: The regular expression for that is `/^([\w\s]+)\s(\d+)$/`.

## Support for German Address Format

Our parser should also be able to parse full addresses with city and zip.

```typescript
it('should parse a German address format with city and zip', () => {
  const lookuper = new AddressLookuper();
  const address = lookuper.parse('Domgasse 5, 1010 Wien');
  expect(address).toEqual({ street: 'Domgasse', streetNumber: '5', city: 'Wien', zip: '1010' });
});
```

\* Hint: The regular expression is `/^([\w\s]+)\s(\d+),\s(\d+)\s(\w+)$/`.

## Provide DataSet for Addresses

It should be possible to pass on a set of address via the constructor.

```typescript
it('should allow addresses in constructor', () => {
  const addresses = ['Domgasse 15, 1010 Wien'];
  const lookuper = new AddressLookuper(addresses);

  expect(lookuper.lookup('Domgasse 5, 1010 Wien')).toBe(false);
  expect(lookuper.lookup('Domgasse 15, 1010 Wien')).toBe(true);
});
```

You will see that the former tests will fail. We don't want to introduce breaking changes. Make sure that all tests run fine.

## Dealing with sort and long notation

The lookuper should be able to provide the address even, if the dataset has long notations and the search short.

```typescript
it('should work with short input and long output', () => {
  const addresses = ['Domgasse 15, 1010 Wien'];
  const lookuper = new AddressLookuper(() => addresses);

  expect(lookuper.lookup('Domgasse 15')).toBe(true);
});
```

## Address DataSet as function

We can expect in that the address dataset will be be fetched by some Geo service. So we should change the data type from an array to a function that returns the array.

We don't create new tests for this, but change the two existing.

```typescript
it('should allow addresses in constructor', () => {
  const addresses = ['Domgasse 15, 1010 Wien'];
  const lookuper = new AddressLookuper(() => addresses);

  expect(lookuper.lookup('Domgasse 5, 1010 Wien')).toBe(false);
  expect(lookuper.lookup('Domgasse 15, 1010 Wien')).toBe(true);
});

it('should work with short input and long output', () => {
  const addresses = ['Domgasse 15, 1010 Wien'];
  const lookuper = new AddressLookuper(() => addresses);

  expect(lookuper.lookup('Domgasse 15')).toBe(true);
});
```

## Bonus: Be Creative

If you are already finished, you can improve the parser. I am sure that you can find some caess where the current code fill fail. Just think of cities that have a space in their name or a street number with a letter... Be creative!!!
