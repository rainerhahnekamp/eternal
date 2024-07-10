import { marbles } from 'rxjs-marbles/jest';
import { of } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

it(
  'should test observables',
  marbles((m) => {
    const numbers$ = m.cold('1s a 500ms b 250ms c', { a: 1, b: 2, c: 3 });
    const destination$ = numbers$.pipe(
      map((n) => n * n),
      delay(200),
      filter((n) => n > 1),
    );

    m.expect(destination$).toBeObservable('1s 200ms - 500ms y 250ms z', {
      x: 1,
      y: 4,
      z: 9,
    });
  }),
);
