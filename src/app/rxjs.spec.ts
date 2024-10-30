import { TestScheduler } from 'rxjs/internal/testing/TestScheduler';
import { expect } from '@jest/globals';
import { debounceTime, map } from 'rxjs/operators';

describe('RxJs marbles', () => {
  let testScheduler: TestScheduler;

  beforeEach(
    () =>
      (testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      })),
  );

  it('should test RxJs', () => {
    return testScheduler.run(({ cold, expectObservable }) => {
      const numbers$ = cold('1s a 1s bc', { a: 1, b: 2, c: 3 });
      const betterNumbers$ = numbers$.pipe(
        map((n) => n * 10),
        debounceTime(500),
      );

      expectObservable(betterNumbers$).toBe('1s 500ms a 1s 1ms c', {
        a: 10,
        c: 30,
      });
    });
  });
});
