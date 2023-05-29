- [1. Multiply by 2](#1-multiply-by-2)
- [2. Unsubscription](#2-unsubscription)
- [3. combineLatest](#3-combinelatest)
- [4. Query Counter](#4-query-counter)
- [5. Custom Operator: filterTruthy](#5-custom-operator-filtertruthy)
- [6. AddressLookuper](#6-addresslookuper)
- [7. Error](#7-error)
- [8. Bonus: Asynchrony](#8-bonus-asynchrony)
- [9. Bonus: Proofing Higher Order Observable](#9-bonus-proofing-higher-order-observable)

Checkout the branch `starter-05-rxjs`.

If not explicitly said otherwise, all test should be done with the `rxjs-marbles` library.

# 1. Multiply by 2

The observable below emits numbers. Create a set of pipe operator(s) where each number is multiplied and verify that via a unit test.

```typescript
m.cold('--a-b-c', { a: 2, b: 10, c: 25 });
```

<details>
<summary>Show Solution</summary>
<p>

```typescript
test(
  'multiply by 2',
  marbles((m) => {
    const source = m.cold('--a-b-c', { a: 2, b: 10, c: 25 });

    const destination = source.pipe(map((n) => n * 2));

    m.expect(destination).toBeObservable('--x-y-z', {
      x: 4,
      y: 20,
      z: 50,
    });
  })
);
```

</p>
</details>

# 2. Unsubscription

```typescript
m.cold('abcde', {
  a: 'Hauptstraße 3',
  b: '',
  c: 'Domgasse 5',
  d: 'Kärntnerring 12',
  e: 'Praterstern 2',
});
```

The observable should complete, when `Domgasse 5` is emitted.

**Hint**: `first` or `takeWhile` made be useful.

<details>
<summary>Show Solution</summary>
<p>

```typescript
test(
  'unsubscription',
  marbles((m) => {
    const source = m.cold('abcde', {
      a: 'Hauptstraße 3',
      b: '',
      c: 'Domgasse 5',
      d: 'Kärntnerring 12',
      e: 'Praterstern 2',
    });

    const destination = source.pipe(
      filter((address) => address === 'Domgasse 5'),
      first()
    );

    m.expect(destination).toBeObservable('--(a|)', { a: 'Domgasse 5' });
  })
);
```

</p>
</details>

# 3. combineLatest

Check if the `combineLatest` operator works as specified.

We have two observable that, where we want to add their emitted values.

```typescript
const s1 = m.cold('-a', { a: 1 });
const s2 = m.cold('a-', { a: 2 });
```

If combineLatest works as expected, the new observable should only emit one value which is 3.

<details>
<summary>Show Solution</summary>
<p>

```typescript
test(
  'combine Latest',
  marbles((m) => {
    const s1 = m.cold('-a', { a: 1 });
    const s2 = m.cold('a-', { a: 2 });

    const dest = combineLatest([s1, s2]).pipe(map(([a, b]) => a + b));
    m.expect(dest).toBeObservable('-a', { a: 3 });
  })
);
```

</p>
</details>

# 4. Query Counter

```typescript
let queryCounter = 0;
const source = m.cold('d 2ms p 2ms h', {
  d: 'Domgasse 5',
  p: 'Praterstern',
  h: 'Herrengasse 12',
});
```

We should filter only queries where a streetNumber is passed. Per valid query, we increate the `queryCounter`. We have 2 valid queries.

**Hint**: You have to implement that via a sideffect.

<details>
<summary>Show Solution</summary>
<p>

```typescript
test(
  'query counter',
  marbles((m) => {
    let searchCounter = 0;
    const source = m.cold('d 2ms p 2ms h', {
      d: 'Domgasse 5',
      p: 'Praterstern',
      h: 'Herrengasse 12',
    });
    const destination = source.pipe(
      map((address) => address.match(/(.+)\s(\d+)$/) || []),
      filter((matcher) => matcher.length > 0),
      tap(() => searchCounter++),
      map(([, street, streetNumber]) => ({
        street,
        streetNumber,
      }))
    );
    m.expect(destination).toBeObservable('d 5ms h', {
      d: { street: 'Domgasse', streetNumber: '5' },
      h: { street: 'Herrengasse', streetNumber: '12' },
    });
    m.flush();
    expect(searchCounter).toBe(2);
  })
);
```

</p>
</details>

# 5. Custom Operator: filterTruthy

Create an operator filterTruthy that does what its name says.

```typescript
m.cold('abcdef', {
  a: null,
  b: undefined,
  c: false,
  d: '',
  e: 0,
  f: 1,
});
```

Only the number 1 will get through the filter.

**Hint**:

```typescript
const filterTruthy = (observable: Observable<unknown>) =>
  observable.pipe(...);
```

You see how to create a new operator above. The filtering should be done inside the pipe.

<details>
<summary>Show Solution</summary>
<p>

```typescript
test(
  'operator filterTruthy',
  marbles((m) => {
    const source = m.cold('abcdef', {
      a: null,
      b: undefined,
      c: false,
      d: '',
      e: 0,
      f: 1,
    });

    const filterTruthy = (observable: Observable<unknown>) => observable.pipe(filter((data) => !!data));
    const destination = source.pipe(filterTruthy);
    m.expect(destination).toBeObservable('-----f', { f: 1 });
  })
);
```

</p>
</details>

# 6. AddressLookuper

Try to apply rxjs-marbles in the AddressLookuper service. You should not require a subscription and also no `of` or `scheduled`.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it(
  'should use rxjs-marbles',
  marbles((m) => {
    const httpClient = assertType<HttpClient>({
      get: () => m.cold('150ms r', { r: [true] }),
    });
    const lookuper = new AddressLookuper(httpClient);
    const isValid$ = lookuper.lookup('Domgasse 5');
    m.expect(isValid$).toBeObservable('150ms t', { t: true });
  })
);
```

</p>
</details>

# 7. Error

The `first` operator throws an `EmptyError` if it hits a completed observable. Make a test to verify that.

An error has the symbol `#` and the third parameter of `toBeObservable` is reserved for the error object.

<details>
<summary>Show Solution</summary>
<p>

```typescript
test(
  'error with first operator on completed',
  marbles((m) => {
    const source$ = m.cold('|');
    const destination$ = source$.pipe(first());

    m.expect(destination$).toBeObservable('#', undefined, new EmptyError());
  })
);
```

</p>
</details>

# 8. Bonus: Asynchrony

For this exercise, you CANNOT use `rxjs-marbles`.

```typescript
const lookuper = (query: string) =>
  new Promise<boolean>((resolve) => {
    resolve(query === 'Domgasse 5');
  });

const source = of('Praterstern', 'Domgasse 5');
const hits: boolean[] = [];
```

Create an observable from `source` that is using the `lookuper` method. It should store the resolved values of `lookuper` into hits. Verify that `hits` has following value: `[false, true]`.

**Hint**: A higher order operator like `concatMap` or `mergeMap` works also against Promises.

<details>
<summary>Show Solution</summary>
<p>

```typescript
test('asynchronicity', (done) => {
  const lookuper = (query) =>
    new Promise<boolean>((resolve) => {
      resolve(query === 'Domgasse 5');
    });

  const source = of('Praterstern', 'Domgasse 5');
  const hits: boolean[] = [];
  source.pipe(concatMap((query) => lookuper(query))).subscribe((isHit) => {
    hits.push(isHit);

    if (hits.length === 2) {
      expect(hits).toEqual([false, true]);
      done();
    }
  });
});
```

</p>
</details>

# 9. Bonus: Proofing Higher Order Observable

Write tests for all 4 major higher order observable and proof their behaviour:

- switchMap
- mergeMap
- concatMap
- exhaustMap

The test structure could look like this

```typescript
test(
  'switchMap',
  marbles((m) => {
    const source: Observable<string> = m.cold('pd', { p: 'Praterstern', d: 'Domgasse 5' });
    const dest: Observable<boolean> = source.pipe(switchMap((query) => m.cold('---b', { b: query === 'Domgasse 5' })));

    m.expect(dest).toBeObservable('insert your marble');
  })
);
```

<details>
<summary>Show Solution</summary>
<p>

```typescript
test(
  'switchMap',
  marbles((m) => {
    const source: Observable<string> = m.cold('pd', { p: 'Praterstern', d: 'Domgasse 5' });
    const dest: Observable<boolean> = source.pipe(switchMap((query) => m.cold('---b', { b: query === 'Domgasse 5' })));

    m.expect(dest).toBeObservable('----t', { t: true });
  })
);

test(
  'mergeMap',
  marbles((m) => {
    const source: Observable<string> = m.cold('pd', { p: 'Praterstern', d: 'Domgasse 5' });
    const dest: Observable<boolean> = source.pipe(mergeMap((query) => m.cold('---b', { b: query === 'Domgasse 5' })));

    m.expect(dest).toBeObservable('---ft', { f: false, t: true });
  })
);

test(
  'concatMap',
  marbles((m) => {
    const source: Observable<string> = m.cold('pd', { p: 'Praterstern', d: 'Domgasse 5' });
    const dest: Observable<boolean> = source.pipe(concatMap((query) => m.cold('---b|', { b: query === 'Domgasse 5' })));

    m.expect(dest).toBeObservable('---f---t', { f: false, t: true });
  })
);

test(
  'exhaustMap',
  marbles((m) => {
    const source: Observable<string> = m.cold('pd', { p: 'Praterstern', d: 'Domgasse 5' });
    const dest: Observable<boolean> = source.pipe(exhaustMap((query) => m.cold('---b', { b: query === 'Domgasse 5' })));

    m.expect(dest).toBeObservable('---f', { f: false, t: true });
  })
);
```

</p>
</details>
