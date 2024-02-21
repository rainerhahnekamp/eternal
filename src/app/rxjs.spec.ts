import { marbles } from 'rxjs-marbles/jest';
import { debounceTime, map } from 'rxjs/operators';

it(
  'should multiply numbers',
  marbles((m) => {
    const numbers$ = m.cold('1s a 500ms bc|', { a: 1, b: 2, c: 3 });
    const product$ = numbers$.pipe(
      map((n) => n * 2),
      debounceTime(500),
    );

    m.expect(product$).toBeObservable('1s 500ms x 2ms (z|)', {
      x: 2,
      y: 4,
      z: 6,
    });
  }),
);
