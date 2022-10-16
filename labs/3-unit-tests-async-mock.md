- [1. Parameterised Test](#1-parameterised-test)
- [2. HttpClient Injection](#2-httpclient-injection)
- [3. Test Mock](#3-test-mock)
- [4. Bonus - Assertive Stub](#4-bonus---assertive-stub)
- [5. Bonus = `createMock` of testing library](#5-bonus--createmock-of-testing-library)
- [6. Bonus - Use `mock` property of `jest.fn`](#6-bonus---use-mock-property-of-jestfn)
- [7. Bonus - Mock via `inject` function](#7-bonus---mock-via-inject-function)

In this lab, we are going to upgrade our lookuper to use the API of nominatim (OpenStreet Map).

We use the file **shared/address-lookuper.serivce.spec.ts**.

# 1. Parameterised Test

Change the **should pass addresses in the constructor** to a parameterised test. Its name should be **should return $expected for $query**. ` $expected` and ` $address` should be the parameters.

<details>
<summary>Show Solution</summary>
<p>

```typescript
for (const { query, expected } of [
  { query: 'Domgasse 5', expected: true },
  {
    query: 'Domgasse 15',
    expected: false
  }
]) {
  it(`should return ${expected} for ${query}`, () => {
    const addresses = ['Domgasse 5, 1010 Wien'];
    const lookuper = new AddressLookuper(() => addresses);

    expect(lookuper.lookup(query)).toBe(expected);
  });
}
```

</p>
</details>

# 2. HttpClient Injection

We pick Nominatim as our GeoService. It offers a free HTTP API.

The `AddressLookuper`'s constructor will use Angular's `HttpClient` to connect to Nominatim. We will have to stub the `HttpClient`.

Nominatim returns an array, with a type of `unknown`. The criteria, if an address is valid or net, is if the array contains elements or not.

No need for additional tests. Adapt the existing ones.

<details>
<summary>Show Solution</summary>
<p>

**shared/assert-type.ts**

```typescript
export function assertType<T>(object: unknown = undefined): T {
  return object as T;
}
```

**shared/address-lookuper.service.spec.ts**

```typescript
import { assertType } from './assert-type';
// ...
for (const { query, expected, response } of [
  { query: 'Domgasse 5', response: ['Domgasse 5'], expected: true },
  { query: 'Domgasse 15', response: [], expected: false }
]) {
  it(`should return ${expected} for ${query}`, fakeAsync(() => {
    const httpClient = assertType<HttpClient>({
      get: () => scheduled([response], asyncScheduler)
    });
    const lookuper = new AddressLookuper(httpClient);

    lookuper.lookup(query).subscribe((isValid) => {
      expect(isValid).toBe(expected);
    });

    tick();
  }));
}
```

**shared/address-lookuper.service.ts**

```typescript
export class AddressLookuper {
  constructor(private httpClient: HttpClient) {}

  lookup(query: string): Observable<boolean> {
    parseAddress(query);

    return this.httpClient.get<unknown[]>('').pipe(map((addresses) => addresses.length > 0));
  }

  // ...
}
```

</p>
</details>

# 3. Test Mock

We want to make sure, that the right parameters are passed to the `HttpClient`.

The url should be https://nominatim.openstreetmap.org/search.php and we should pass query strings for format and the actual query.

A search request for "Domgasse 5" is https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Domgasse%205.

Create a new test that verifies the mocked is called in the right way.

<details>
<summary>Show Solution</summary>
<p>

**shared/address-lookuper.service.spec.ts**

```typescript
it('should call nominatim with right parameters', () => {
  const httpClient = { get: jest.fn() };
  httpClient.get.mockReturnValue(of([]));

  const lookuper = new AddressLookuper(assertType<HttpClient>(httpClient));
  lookuper.lookup('Domgasse 5');

  expect(httpClient.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/search.php', {
    params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
  });
});
```

**shared/address-lookuper.service.ts**

```typescript
// inside the lookup method
return this.httpClient
  .get<string[]>('https://nominatim.openstreetmap.org/search.php', {
    params: new HttpParams().set('format', 'jsonv2').set('q', query)
  })
  .pipe(map((addresses) => addresses.length > 0));
```

</p>
</details>

# 4. Bonus - Assertive Stub

Try to come up with a stub for the `HttpClient` that also asserts that the right parameters are used.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it(`should have an assertive stub`, async () => {
  const httpClientStub = assertType<HttpClient>({
    get(url: string, options: { params: HttpParams }) {
      expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
      expect(options.params).toEqual(
        new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
      );

      return scheduled([['']], asyncScheduler);
    }
  });

  const lookuper = new AddressLookuper(httpClientStub);
  const result = await firstValueFrom(lookuper.lookup('Domgasse 5'));

  expect(result).toBe(true);
});
```

</p>
</details>

# 5. Bonus = `createMock` of testing library

Use the installed library "@testing-library/angular" to verify the behaviour of the HttpClient. `createMock` instantiates a new object and replaces all its methods with `jest.fn`.

You can apply it on `HttpClient` by

```typescript
const httpClient = createMock(HttpClient);
```

You will see that `httpClient.get`can then be used as any other `jest.fn`.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should test http with createMock', () => {
  const httpClient = createMock(HttpClient);
  httpClient.get.mockReturnValue(of([]));

  const lookuper = new AddressLookuper(httpClient);
  lookuper.lookup('Domgasse 5');

  expect(httpClient.get).toHaveBeenCalledWith('https://nominatim.openstreetmap.org/search.php', {
    params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
  });
});
```

</p>
</details>

# 6. Bonus - Use `mock` property of `jest.fn`

Write another version of the mocked "should call nominatim with right parameters" test. This time, don't use the matcher `hasBeenCalledWith` but get the passed arguments from the `mock` property of your stub and match against them.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should call nominatim with right parameters, (mock property version)', () => {
  const httpClient = {
    get: jest.fn<Observable<undefined[]>, [string, { params: HttpParams }]>()
  };
  httpClient.get.mockReturnValue(of([]));
  const lookuper = new AddressLookuper(assertType<HttpClient>(httpClient));
  lookuper.lookup('Domgasse 5');

  const [url, { params }] = httpClient.get.mock.calls[0];
  expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
  expect(params).toEqual(new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5'));
});
```

</p>
</details>

# 7. Bonus - Mock via `inject` function

Instead of using constructor-based dependency injection, use the `inject` function introduced in Angular 14.

The `AddressLookuper` would look like that:

```typescript
@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  private httpClient = inject(HttpClient);

  // ...
}
```

You'll have to use a spy for the `inject` function. It is a little bit hacky though. Add the following import in your test:

```typescript
import * as angularCore from "@angular/core",
```

You can then run a `jest.spyOn` against the `angularCore` and use the `inject` function.

Lookup the final solution in the branch **solution-3-unit-tests-async-mock**.
