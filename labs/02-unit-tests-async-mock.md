- [1. Observable Injection](#1-observable-injection)
- [2. HttpClient Injection](#2-httpclient-injection)
- [3. Test Mock](#3-test-mock)
- [4. No internal check against addresses](#4-no-internal-check-against-addresses)
- [5. Bonus: Assertive Stub](#5-bonus-assertive-stub)
- [6. Bonus: Mock parse function](#6-bonus-mock-parse-function)
- [7. Bonus: Http Interceptor](#7-bonus-http-interceptor)

In this lab, we are going to upgrade our lookuper to use the API of nominatim (OpenStreet Map).

# 1. Observable Injection

First of all remove the test **should work with short query input and long address store**. We don't require it anymore because the actual lookup will be done by the API.

The type of the `AddressLookuper`'s constructor argument should be changed to an Observable: `Observable<string[]>`. The method `lookup` must therefore return an `Observable<boolean>`.

Update the tests first and then the implemenation. The first tests must be transformed into a parameterised test (`it.each`) well.

<details>
<summary>Show Solution</summary>
<p>

**shared/address-lookuper.service.spec.ts**

```typescript
import { asyncScheduler, of, scheduled } from 'rxjs';
import { AddressLookuper } from './address-lookuper.service';
import DoneCallback = jest.DoneCallback;

describe('Address Lookuper', () => {
  it.each<any>([
    [true, 'Domgasse 5'],
    [false, 'Domgasse 15']
  ])(`should return %s for %s`, (expected: boolean, query: string, done: DoneCallback) => {
    const lookuper = new AddressLookuper(scheduled([['Domgasse 5']], asyncScheduler));
    lookuper.lookup(query).subscribe((isValid) => {
      expect(isValid).toBe(expected);
      done();
    });
  });

  it('should throw an error if no street number is given', () => {
    const lookuper = new AddressLookuper(of([]));

    expect(() => lookuper.lookup('Domgasse')).toThrowError('Address without street number');
  });
});
```

**shared/address-lookuper.service.ts**

```typescript
export class AddressLookuper {
  constructor(private addresses$: Observable<string[]>) {}

  lookup(query: string): Observable<boolean> {
    if (!parseAddress(query)) {
      throw new Error('Address without street number');
    }

    return this.addresses$.pipe(
      map((addresses) => addresses.some((address) => address.startsWith(query)))
    );
  }
}
```

</p>
</details>

# 2. HttpClient Injection

We have identified nominatim as the geo service we want to use. It offers a free HTTP interface.

The `AddressLookuper`'s constructor will use Angular's `HttpClient` to fetch the adresses. We will have to mock that.

No need for additional tests. Use the existing ones. You don't have to use `jest.fn()` or `jest.spyOn()` because we don't need to assert the communication with the mock.

<details>
<summary>Show Solution</summary>
<p>

**shared/mock.ts**

```typescript
export function mock<T>(object: unknown): T {
  return object as T;
}
```

**shared/address-lookuper.service.spec.ts**

```typescript
import { mock } from './mock';
// ...
it(`should return %s for %s`, (expected: boolean, query: string, done: DoneCallback) => {
  const httpClient = mock<HttpClient>({ get: () => scheduled([['Domgasse 5']], asyncScheduler) }); // <- add this
  const lookuper = new AddressLookuper(httpClient); // <- replace existing lookuper instantation with this
});

it('should throw an error if no street number is given', () => {
  const lookuper = new AddressLookuper(mock<HttpClient>(null)); // <- replace existing instantiation
});
```

**shared/address-lookuper.service.ts**

```typescript
export class AddressLookuper {
  constructor(private httpClient: HttpClient) {}

  lookup(query: string): Observable<boolean> {
    if (!parseAddress(query)) {
      throw new Error('Address without street number');
    }

    return this.httpClient
      .get<string[]>('')
      .pipe(map((addresses) => addresses.some((address) => address.startsWith(query))));
  }
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
  const httpClient = { get: jest.fn((url: string, options: { params: HttpParams }) => of([])) };
  const lookuper = new AddressLookuper(mock<HttpClient>(httpClient));

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
  .pipe(map((addresses) => addresses.some((address) => address.startsWith(query))));
```

</p>
</details>

# 4. No internal check against addresses

At the moment, we lookup the address in Nominatim's response. Nominatim already does the lookup for us. It response contains only addresses that match the query. All we have to do, is to check if we get an empty array as response or not.

Instead of paramterise the query, the parameter should be the response (`string[]`). The query can be a static value like `Domgasse 5`.

<details>
<summary>Show Solution</summary>
<p>

Final solution in the **solutions** directory.

</p>
</details>

# 5. Bonus: Assertive Stub

Try to come up with a stub for the `HttpClient` that also asserts that the right parameters are used.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it(`should have an assertive stub`, (done) => {
  const httpClientStub = mock<HttpClient>({
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

# 6. Bonus: Mock parse function

Create a new test file for the lookuper. In that test mock `parseAddress` via `jest.mock` so it doesn't throw an error on invalid queries.

<details>
<summary>Show Solution</summary>
<p>

**Note:** The mock directory must have underscores.

**shared/\_\_mocks\_\_/parse-address.ts**

```typescript
import { Address } from '../address';

export function parseAddress(query: string): Address {
  return { street: 'Domgasse', streetNumber: '5' };
}
```

**shared/address-lookuper-pure.service.spec.ts**

```typescript
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AddressLookuper } from './address-lookuper.service';

jest.mock('./parse-address');

describe('Address Lookuper', () => {
  it('should work with invalid addresses', (done) => {
    const lookuper = new AddressLookuper(
      mock<HttpClient>({ get: () => of(['']) })
    );

    lookuper.lookup('Domgasse').subscribe((isValid) => {
      expect(isValid).toBe(true);
      done();
    });
  });
});
```

</p>
</details>

# 7. Bonus: Http Interceptor

- We create an Http Interceptor that adds a new http header when the nominatim endpoint is called. The header's key is `NominatimId` and the value `0129`.

```typescript
@Injectable({
  providedIn: 'root'
})
export class NominatimInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
import { mock } from './mock';
import { NominatimInterceptor } from './nominatim.interceptor';

describe('NominatimService', () => {
  it('should add the header', () => {
    const req = new HttpRequest('GET', 'https://nominatim.openstreetmap.org/search');
    const next = {
      handle: jest.fn<void, [HttpRequest<unknown>]>()
    };

    new NominatimInterceptor().intercept(req, mock<HttpHandler>(next));
    const clonedReq = next.handle.mock.calls[0][0];
    expect(clonedReq.headers.get('NominatimId')).toBe('0129');
  });

  it('should not add the header', () => {
    const req = new HttpRequest('GET', 'https://maps.google.com/search');
    const next = {
      handle: jest.fn<void, [HttpRequest<unknown>]>()
    };

    new NominatimInterceptor().intercept(req, mock<HttpHandler>(next));
    const clonedReq = next.handle.mock.calls[0][0];
    expect(clonedReq.headers.has('NominatimId')).toBe(false);
  });
});
```

</p>
</details>
