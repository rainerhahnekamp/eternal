import { debounceTime, filter, first, map } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('RxJS Marble Testing', () => {
  let testScheduler: TestScheduler;
  beforeEach(
    () =>
      (testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      })),
  );

  it('should test a simple observable', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a-b-c', { a: 1, b: 2, c: 3 });
      const destination$ = source$.pipe(
        debounceTime(300),
        map((n) => n * 10),
        filter((n) => n > 10),
        first(),
      );

      expectObservable(destination$).toBe('304ms (c|)', { c: 30 });
    });
  });
});
