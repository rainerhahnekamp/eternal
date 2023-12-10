import { marbles } from 'rxjs-marbles/jest';
import {
  combineLatest,
  EmptyError,
  exhaustMap,
  first,
  map,
  mergeMap,
  Observable,
  of,
} from 'rxjs';
import { concatMap, filter, switchMap, tap } from 'rxjs/operators';
import { expect } from '@jest/globals';

describe('RxJs', () => {
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
    }),
  );

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
    }),
  );

  test(
    'combine Latest',
    marbles((m) => {
      const s1 = m.cold('-a', { a: 1 });
      const s2 = m.cold('a-', { a: 2 });

      const dest = combineLatest([s1, s2]).pipe(map(([a, b]) => a + b));
      m.expect(dest).toBeObservable('-a', { a: 3 });
    }),
  );

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
        })),
      );
      m.expect(destination).toBeObservable('d 5ms h', {
        d: { street: 'Domgasse', streetNumber: '5' },
        h: { street: 'Herrengasse', streetNumber: '12' },
      });
      m.flush();
      expect(searchCounter).toBe(2);
    }),
  );

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

      const filterTruthy = (observable: Observable<unknown>) =>
        observable.pipe(filter((data) => !!data));
      const destination = source.pipe(filterTruthy);
      m.expect(destination).toBeObservable('-----f', { f: 1 });
    }),
  );

  test(
    'error with first operator on completed',
    marbles((m) => {
      const source$ = m.cold('|');
      const destination$ = source$.pipe(first());

      m.expect(destination$).toBeObservable('#', undefined, new EmptyError());
    }),
  );

  test('asynchronicity', (done) => {
    const lookuper = (query: string) =>
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

  test(
    'switchMap',
    marbles((m) => {
      const source: Observable<string> = m.cold('pd', {
        p: 'Praterstern',
        d: 'Domgasse 5',
      });
      const dest: Observable<boolean> = source.pipe(
        switchMap((query) => m.cold('---b', { b: query === 'Domgasse 5' })),
      );

      m.expect(dest).toBeObservable('----t', { t: true });
    }),
  );

  test(
    'mergeMap',
    marbles((m) => {
      const source: Observable<string> = m.cold('pd', {
        p: 'Praterstern',
        d: 'Domgasse 5',
      });
      const dest: Observable<boolean> = source.pipe(
        mergeMap((query) => m.cold('---b', { b: query === 'Domgasse 5' })),
      );

      m.expect(dest).toBeObservable('---ft', { f: false, t: true });
    }),
  );

  test(
    'concatMap',
    marbles((m) => {
      const source: Observable<string> = m.cold('pd', {
        p: 'Praterstern',
        d: 'Domgasse 5',
      });
      const dest: Observable<boolean> = source.pipe(
        concatMap((query) => m.cold('---b|', { b: query === 'Domgasse 5' })),
      );

      m.expect(dest).toBeObservable('---f---t', { f: false, t: true });
    }),
  );

  test(
    'exhaustMap',
    marbles((m) => {
      const source: Observable<string> = m.cold('pd', {
        p: 'Praterstern',
        d: 'Domgasse 5',
      });
      const dest: Observable<boolean> = source.pipe(
        exhaustMap((query) => m.cold('---b', { b: query === 'Domgasse 5' })),
      );

      m.expect(dest).toBeObservable('---f', { f: false, t: true });
    }),
  );
});
