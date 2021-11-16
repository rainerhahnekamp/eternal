- [1. Parameterised Test](#1-parameterised-test)
- [2. HttpClient Injection](#2-httpclient-injection)
- [3. Test Mock](#3-test-mock)
- [4. No internal check against addresses](#4-no-internal-check-against-addresses)
- [5. Bonus: Assertive Stub](#5-bonus-assertive-stub)
- [6. Bonus: `jest-auto-spies`](#6-bonus-jest-auto-spies)
- [7: Bonus: Use `mock` property of `jest.fn`](#7-bonus-use-mock-property-of-jestfn)
- [8. Bonus: Mock parse function](#8-bonus-mock-parse-function)
- [9. Bonus: Http Interceptor](#9-bonus-http-interceptor)

In this lab, we are going to upgrade our lookuper to use the API of nominatim (OpenStreet Map).

First of all remove the test **should work with short query input and long address store**. Nominatim itself will do the matching.

# 1. Parameterised Test

Change the **should pass addresses in the constructor** to a parameterised test. Its name should be **should return $expected for $query**. ` $expected` and ` $address` should be the parameters.

<details>
<summary>Show Solution</summary>
<p>

```typescript
for (let { query, expected } of [
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
for (let { query, expected } of [
  { query: 'Domgasse 5', expected: true },
  { query: 'Domgasse 15', expected: false }
]) {
  it(
    `should return ${expected} for ${query}`,
    waitForAsync(() => {
      const httpClient = assertType<HttpClient>({
        get: () => scheduled([['Domgasse 5']], asyncScheduler)
      });
      const lookuper = new AddressLookuper(httpClient);

      lookuper.lookup(query).subscribe((isValid) => {
        expect(isValid).toBe(expected);
      });
    })
  );
}
```

**shared/address-lookuper.service.ts**

```typescript
export class AddressLookuper {
  constructor(private httpClient: HttpClient) {}

  lookup(query: string): Observable<boolean> {
    parseAddress(query);
    return this.httpClient
      .get<string[]>('')
      .pipe(map((addresses) => addresses.some((address) => address.startsWith(query))));
  }

  ...
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
    params: new HttpParams().set('format', 'jsonv2').set('q', 'Domgasse 5')
  })
  .pipe(map((addresses) => addresses.some((address) => address.startsWith(query))));
```

</p>
</details>

# 4. No internal check against addresses

We match the addresses internally, i.e `address.startsWith(query)`. That's not required because Nominatim does this already. It returns an array that contains only matched addresses. All we have to do, is to check if that array is empty or not.

Implement this new behaviour by adapting the existing parameterised test.

<details>
<summary>Show Solution</summary>
<p>

**shared/address-lookuper.service.spec.ts**

```typescript
for (let { response, expected } of [
  { response: [undefined], expected: true },
  { response: [], expected: false }
]) {
  it(
    `should return ${expected} for ${response}`,
    waitForAsync(() => {
      const httpClient = assertType<HttpClient>({
        get: () => scheduled([response], asyncScheduler)
      });
      const lookuper = new AddressLookuper(httpClient);

      lookuper.lookup('Domgasse 5').subscribe((isValid) => {
        expect(isValid).toBe(expected);
      });
    })
  );
}
```

**shared/address-lookuper.service.ts**

```typescript
// inside the lookup method
return this.httpClient
  .get<undefined[]>('https://nominatim.openstreetmap.org/search.php', {
    params: new HttpParams().set('format', 'jsonv2').set('q', query)
  })
  .pipe(map((response) => response.length > 0));
```

</p>
</details>

# 5. Bonus: Assertive Stub

Try to come up with a stub for the `HttpClient` that also asserts that the right parameters are used.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it(`should have an assertive stub`, (done) => {
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

  lookuper.lookup('Domgasse 5').subscribe((result) => {
    expect(result).toBe(true);
    done();
  });
});
```

</p>
</details>

# 6. Bonus: `jest-auto-spies`

Use the installed library jest-auto-spies to verify the behaviour of the HttpClient. jest-auto-spies instantiates a new object and replaces all its methods with `jest.fn`.

You can apply it on `HttpClient` by

```typescript
const httpClient = createSpyFromClass(HttpClient);
```

You will see that `httpClient.get`can then be used as any other `jest.fn`.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it('should test http with jest-auto-spies', () => {
  const httpClient = createSpyFromClass(HttpClient);
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

# 7: Bonus: Use `mock` property of `jest.fn`

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

# 8. Bonus: Mock parse function

Create a new test file for the lookuper. In that test mock `parseAddress` via `jest.mock` so it doesn't throw an error on invalid queries.

<details>
<summary>Show Solution</summary>
<p>

**shared/address-lookuper.service.pure.spec.ts**

```typescript
import { HttpClient } from '@angular/common/http';
import { waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { AddressLookuper } from './address-lookuper.service';
import { assertType } from './assert-type';

jest.mock('./parse-address', () => ({
  parseAddress: () => {}
}));

describe('Address Lookuper', () => {
  it(
    'should work with invalid addresses',
    waitForAsync(() => {
      const lookuper = new AddressLookuper(
        assertType<HttpClient>({ get: () => of(['']) })
      );

      lookuper.lookup('Domgasse').subscribe((isValid) => {
        expect(isValid).toBe(true);
      });
    })
  );
});
```

</p>
</details>

# 9. Bonus: Http Interceptor

- We create an Http Interceptor that adds a new http header when the nominatim endpoint is called. The header's key is `NominatimId` and the value `0129`.

**core/nominatim.interceptor.ts**

```typescript
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominatimInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.match(/nominatim\.openstreetmap\.org/)) {
      return next.handle(req.clone({ setHeaders: { NominatimId: '0129' } }));
    }

    return next.handle(req);
  }
}
```

- Write two unit tests. One verifying that the header is set and one for the opposite.

<details>
<summary>Show Solution</summary>
<p>

**nominatim.interceptor.spec.ts**

```typescript
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { assertType } from '../shared/assert-type';
import { NominatimInterceptor } from './nominatim.interceptor';

describe('NominatimService', () => {
  it('should add the header', () => {
    const req = new HttpRequest('GET', 'https://nominatim.openstreetmap.org/search');
    const next = {
      handle: jest.fn<void, [HttpRequest<unknown>]>()
    };

    new NominatimInterceptor().intercept(req, assertType<HttpHandler>(next));
    const clonedReq = next.handle.mock.calls[0][0];
    expect(clonedReq.headers.get('NominatimId')).toBe('0129');
  });

  it('should not add the header', () => {
    const req = new HttpRequest('GET', 'https://maps.google.com/search');
    const next = {
      handle: jest.fn<void, [HttpRequest<unknown>]>()
    };

    new NominatimInterceptor().intercept(req, assertType<HttpHandler>(next));
    const clonedReq = next.handle.mock.calls[0][0];
    expect(clonedReq.headers.has('NominatimId')).toBe(false);
  });
});
```

</p>
</details>
