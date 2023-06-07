- [1. ngrx Reducer](#1-ngrx-reducer)
- [2. ngrx Selectors](#2-ngrx-selectors)
- [3. ngrx Effect](#3-ngrx-effect)

Checkout the branch `starter-04-rxjs`.

# 1. ngrx Reducer

Let's test the reducer.

**holidays/+state/holidays.reducer.spec.ts**

```typescript
it('should add the holidays on findHolidaySuccess', () => {
  const holidays = [
    { id: 1, title: 'Pyramids' },
    { id: 2, title: 'Tower Bridge' },
  ] as Holiday[];

  const state = holidaysFeature.reducer({ holidays: [] }, holidaysActions.findHolidaysSuccess({ holidays }));

  expect(state).toEqual({ holidays });
});
```

Write two other tests, one testing that the action `findHoliday` doesn't change anyhting and another that a `findHolidaySuccess` overwrites pre-existing holidays.

<details>
<summary>Show Solution</summary>
<p>

**holidays/+state/holidays.reducer.spec.ts**

```typescript
it('should be no state change on findHoliday', () => {
  const state = holidaysFeature.reducer({ holidays: [] }, holidaysActions.findHolidays());

  expect(state).toEqual({ holidays: [] });
});

it('should replace existing holidays on findHolidaySuccess', () => {
  const initialState = { holidays: [{ id: 1, title: 'Pyramids' }] as Holiday[] };

  const state = holidaysFeature.reducer(
    initialState,
    holidaysActions.findHolidaysSuccess({
      holidays: [{ id: 2, title: 'Tower Bridge' } as Holiday],
    })
  );

  expect(state.holidays).toEqual([{ id: 2, title: 'Tower Bridge' } as Holiday]);
});
```

</p>
</details>

# 2. ngrx Selectors

Even easier and simpler than to test the reducer.

**holidays/+state/holidays.selectors.spec.ts**

```typescript
it('should select the holidays', () => {
  const state: HolidaysState = {
    holidays: [
      { id: 1, title: 'Pyramids' },
      { id: 2, title: 'Tower Bridge' },
    ] as Holiday[],
  };

  expect(fromHolidays.get.projector(state)).toEqual([
    { id: 1, title: 'Pyramids' },
    { id: 2, title: 'Tower Bridge' },
  ] as Holiday[]);
});
```

# 3. ngrx Effect

In order to test our effects, we create a new file **holiday.effects.spec.ts**. The properties in an effect are nothing more than normal Observables and we can test also test them as we do with all others.

```typescript
it(
  'should test find$',
  marbles((m) => {
    const httpClient = {
      get: () => m.cold('---a', { a: [{ id: 1, imageUrl: '/pyramids.jpg' }] }),
    };
    const actions$ = m.cold('a', { a: holidaysActions.findHolidays() });

    const effect = new HolidaysEffects(actions$, httpClient as unknown as HttpClient, 'http://api.eternal-holidays.net');
    m.expect(effect.find$).toBeObservable('3ms a', {
      a: holidaysActions.findHolidaysSuccess({
        holidays: [
          {
            id: 1,
            imageUrl: 'http://api.eternal-holidays.net/pyramids.jpg',
          } as unknown as Holiday,
        ],
      }),
    });
  })
);
```
