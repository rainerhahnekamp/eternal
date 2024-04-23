import { marbles } from 'rxjs-marbles/jest';
import { map } from "rxjs/operators";


/**
 * Use cases for RxJs Marbles
 *
 * 1. Observables with lot of pipe operators
 * 2. Own pipe operators
 * 3. Observable where "timing testing" is also important
 */
it(
  'should use RxJs Marbles',
  marbles((m) => {
    const source$ = m.cold('a 1s b 1s c', { a: 1, b: 2, c: 3 });
    const destination$ = source$.pipe(map(number => number * 2))

    m.expect(destination$).toBeObservable('x 1s y 1s z', {x: 2, y: 4, z: 6})
  }),
);
