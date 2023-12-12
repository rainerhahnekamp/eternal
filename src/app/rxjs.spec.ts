import { marbles } from 'rxjs-marbles/jest';
import { delay, filter, first, map } from 'rxjs/operators';

it(
  'should use an Observable',
  marbles((m) => {
    const source$ = m.cold('1s ab 500ms c', { a: 1, b: 2, c: 3 });
    const destination$ = source$.pipe(
      delay(100),
      filter((n) => n > 2),
      map((n) => n * 2),
      first(),
    );
    m.expect(destination$).toBeObservable('1s 100ms -- 500ms (z|)', {
      x: 2,
      y: 4,
      z: 6,
    });
  }),
);
