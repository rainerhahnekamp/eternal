# Angular Workshop: Testing / Unit Tests

- [Angular Workshop: Testing / Unit Tests](#angular-workshop-testing--unit-tests)
  - [Test async method](#test-async-method)
  - [Test Observable](#test-observable)
  - [Ensure that we have expets in each test.](#ensure-that-we-have-expets-in-each-test)
  - [Test Http Injection](#test-http-injection)
  - [Test Right Parameters are passed to Injection](#test-right-parameters-are-passed-to-injection)
  - [No internal check for addresses](#no-internal-check-for-addresses)
  - [Show Test Coverage](#show-test-coverage)
  - [Enforce Test Coverage Thresholds](#enforce-test-coverage-thresholds)
  - [TODO](#todo)
    - [Fix Mapping between Nomination and our format](#fix-mapping-between-nomination-and-our-format)
    - [Check reporters](#check-reporters)

We already know, that we load the dataset via an http service. We have identified Nominatim for that. We know how the endpoint works and what it returns.

In this lab, we are going to upgrade our lookuper to use that service. It should also demonstrate how much we can achieve with plain unit tests.

## Test async method

The supplier function needs to return a promise. We don't have to create a new test for that but just adopt the existing one. This also has the effect, that the lookup method will return a promise as well. Unfortunately, that code change will mean that most of our unit tests need be changed.

Replace the test 'should allow addresses in constructor' with the follwing:

```typescript
it("should allow an async addresses function in the constructor", () => {
  const addresses = () => Promise.resolve(["Domgasse 15, 1010 Wien"]);
  const lookuper = new AddressLookuper(addresses);

  expect(lookuper.lookup("Domgasse 5, 1010 Wien")).resolves.toBe(false);
  expect(lookuper.lookup("Domgasse 15, 1010 Wien")).resolves.toBe(true);
});
```

Implementation Tip: Use it.only and make all changes to fix that test. After that remove only and fix the rest.

## Test Observable

All of a sudden we realise that we are Angular developers and abandoned Promises for quite some time. We use Observables. Our address supplier and lookup method, will therefore need to return an Observable :(. OK, rewrite the test and start all over. That's life.

```typescript
it("should allow a function returning observables of address in the constructor", () => {
  const addresses = () => of(["Domgasse 15, 1010 Wien"]);
  const lookuper = new AddressLookuper(addresses);

  combineLatest([
    lookuper.lookup("Domgasse 5, 1010 Wien"),
    lookuper.lookup("Domgasse 15, 1010 Wien"),
  ]).subscribe(([first, second]) => {
    expect(first).toBe(false);
    expect(second).toBe(true);
  });
});
```

## Ensure that we have expets in each test.

If you did not use the done callback pattern and did not follow strictly the first-fail approach, your expects might never run. We ensure that by adding an afterEach.

```typescript
afterEach(() => expect.hasAssertions());
```

## Test Http Injection

Let's get serious. We have identified nomination as the geo service we want to use. It offers an http interface. The address lookup will use Angular's http client to fetch the adresses. We will have to mock that one. Again no need for additional tests. We just need to change the existing ones.

```typescript
it("should mock an http client", () => {
  const addresses$ = of(["Domgasse 15, 1010 Wien"]);
  const get = jest.fn<Observable<string[]>, [string]>(() => addresses$);
  const httpClient = ({ get } as unknown) as HttpClient;
  const lookuper = new AddressLookuper(httpClient);

  combineLatest([
    lookuper.lookup("Domgasse 5, 1010 Wien"),
    lookuper.lookup("Domgasse 15"),
  ]).subscribe(([first, second]) => {
    expect(first).toBe(false);
    expect(second).toBe(true);
  });
});
```

Since http client is mandatory, we can now remove all tests which have an empty constructor. The only which should be left, is the error check when a streetNumber is not available. Also the sanity check should stay. We can safely pass null to the constructor.

## Test Right Parameters are passed to Injection

We want to make sure, that the right parameters are passed to the http client. We create a further to verify that.

```typescript
it("should verify right params for nomination are called", () => {
  const get = jest.fn<Observable<string[]>, [string, { params: HttpParams }]>(
    () => of([])
  );
  const httpClient = ({ get } as unknown) as HttpClient;
  const lookuper = new AddressLookuper(httpClient);

  lookuper.lookup("Domgasse 5");

  const [url, { params }] = get.mock.calls[0];
  expect(url).toBe("https://nominatim.openstreetmap.org/search.php");
  const paramsMap = fromPairs(
    params.keys().map((key) => [key, params.get(key)])
  );
  expect(paramsMap).toMatchObject({ format: "jsonv2", street: "Domgasse 5" });
});
```

## No internal check for addresses

Since Nomination already checks for us if the address exists or not, we need to make sure that the lookuper just checks against an empty result

```typescript
it("should just check if nomination returns something", (done) => {
  const get = jest.fn<Observable<any[]>, [string, { params: HttpParams }]>(() =>
    of([[], "a", 1])
  );
  const httpClient = ({ get } as unknown) as HttpClient;
  const lookuper = new AddressLookuper(httpClient);

  lookuper.lookup("Domgasse 5").subscribe((result) => {
    expect(result).toBe(true);
    done();
  });
});
```

We can also safely remove the test **should work with short input and long output**.

## Show Test Coverage

Run Jest with enabled test coverage and check its output. At the moment it should be 100%.

```bash
npx jest --collect-coverage
```

## Enforce Test Coverage Thresholds

Require a global test coverage rate of 100%. Add some function the address-lookuper, and add the following configuration to `jest.config.js`.

```js
module.exports = {
  // append this to the jest.config.js. Don't replace it
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
```

Now run again jest with the collect coverage flag and make sure that it fails.

## TODO

### Fix Mapping between Nomination and our format

### Check reporters
