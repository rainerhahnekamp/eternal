import {
  combineLatest,
  exhaustMap,
  first,
  lastValueFrom,
  map,
  mergeMap,
  Observable,
  of,
  reduce,
  switchMap,
} from 'rxjs';
import { TestScheduler } from 'rxjs/internal/testing/TestScheduler';
import { concatMap, filter, tap } from 'rxjs/operators';
import { expect, describe, test, beforeEach } from 'vitest';

describe('RxJs', () => {
  let testScheduler: TestScheduler;

  beforeEach(
    () =>
      (testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      })),
  );

  test('multiply by 2', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source = cold('--a-b-c', { a: 2, b: 10, c: 25 });
      const destination = source.pipe(map((n) => n * 2));

      expectObservable(destination).toBe('--x-y-z', {
        x: 4,
        y: 20,
        z: 50,
      });
    });
  });

  test('unsubscription', () =>
    testScheduler.run(({ cold, expectObservable }) => {
      const source = cold('abcde', {
        a: 'Hauptstraße 3',
        b: '',
        c: 'Domgasse 5',
        d: 'Kärntnerring 12',
        e: 'Praterstern 2',
      });

      const destination = source.pipe(
        filter((address) => address === 'Domgasse 5'),
        first(),
      );

      expectObservable(destination).toBe('--(a|)', { a: 'Domgasse 5' });
    }));

  test('combine Latest', () =>
    testScheduler.run(({ cold, expectObservable }) => {
      const s1 = cold('-a', { a: 1 });
      const s2 = cold('a-', { a: 2 });

      const dest = combineLatest([s1, s2]).pipe(map(([a, b]) => a + b));
      expectObservable(dest).toBe('-a', { a: 3 });
    }));

  test('query counter', () =>
    testScheduler.run(({ cold, expectObservable, flush }) => {
      let searchCounter = 0;
      const source = cold('d 2ms p 2ms h', {
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
        })),
      );
      expectObservable(destination).toBe('d 5ms h', {
        d: { street: 'Domgasse', streetNumber: '5' },
        h: { street: 'Herrengasse', streetNumber: '12' },
      });
      flush();
      expect(searchCounter).toBe(2);
    }));

  test('operator filterTruthy', () =>
    testScheduler.run(({ cold, expectObservable }) => {
      const source = cold('abcdef', {
        a: null,
        b: undefined,
        c: false,
        d: '',
        e: 0,
        f: 1,
      });

      const filterTruthy = (observable: Observable<unknown>) =>
        observable.pipe(filter((data) => !!data));
      const destination = source.pipe(filterTruthy);
      expectObservable(destination).toBe('-----f', { f: 1 });
    }));

  test('asynchronicity', async () => {
    const lookuper = (query: string) =>
      new Promise<boolean>((resolve) => {
        resolve(query === 'Domgasse 5');
      });

    const source = of('Praterstern', 'Domgasse 5');
    const hits: boolean[] = await lastValueFrom(
      source.pipe(
        concatMap((query) => lookuper(query)),
        reduce((acc, value) => [...acc, value], new Array<boolean>()),
      ),
    );
    expect(hits).toEqual([false, true]);
  });

  test('switchMap', () =>
    testScheduler.run(({ cold, expectObservable }) => {
      const source: Observable<string> = cold('pd', {
        p: 'Praterstern',
        d: 'Domgasse 5',
      });
      const dest: Observable<boolean> = source.pipe(
        switchMap((query) => cold('---b', { b: query === 'Domgasse 5' })),
      );

      expectObservable(dest).toBe('----t', { t: true });
    }));

  test('mergeMap', () =>
    testScheduler.run(({ cold, expectObservable }) => {
      const source: Observable<string> = cold('pd', {
        p: 'Praterstern',
        d: 'Domgasse 5',
      });
      const dest: Observable<boolean> = source.pipe(
        mergeMap((query) => cold('---b', { b: query === 'Domgasse 5' })),
      );

      expectObservable(dest).toBe('---ft', { f: false, t: true });
    }));

  test('concatMap', () =>
    testScheduler.run(({ cold, expectObservable }) => {
      const source: Observable<string> = cold('pd', {
        p: 'Praterstern',
        d: 'Domgasse 5',
      });
      const dest: Observable<boolean> = source.pipe(
        concatMap((query) => cold('---b|', { b: query === 'Domgasse 5' })),
      );

      expectObservable(dest).toBe('---f---t', { f: false, t: true });
    }));

  test('exhaustMap', () =>
    testScheduler.run(({ cold, expectObservable }) => {
      const source: Observable<string> = cold('pd', {
        p: 'Praterstern',
        d: 'Domgasse 5',
      });
      const dest: Observable<boolean> = source.pipe(
        exhaustMap((query) => cold('---b', { b: query === 'Domgasse 5' })),
      );

      expectObservable(dest).toBe('---f', { f: false, t: true });
    }));
});
