import { marbles } from 'rxjs-marbles/jest';
import { debounceTime, delay, map } from 'rxjs/operators';
import { first } from 'rxjs';

it(
  'should use RxJs marbles',
  marbles((m) => {
    const source$ = m.cold('1s a--b 1500ms c', { a: 1, b: 10, c: 100 });
    const destination$ = source$.pipe(
      delay(1000),
      debounceTime(5),
      map((v) => v * 2),
      first(),
    );

    m.expect(destination$).toBeObservable('2s --- 5ms (b|)', {
      b: 20,
    });
  }),
);
