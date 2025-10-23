import { expect, describe, it, vitest, afterEach, beforeEach } from 'vitest';
import { lastValueFrom, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const wait = (timeout = 0) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

describe('async', () => {
  it.skip('should use setTimeout', () => {
    let a = 1;
    setTimeout(() => {
      a++;
      expect(a).toBe(1);
    });
  });

  it('should use a Promise', async () => {
    const a = 1;
    const promise = Promise.resolve().then(() => {
      return a + 1;
    });

    expect(await promise).toBe(2);
  });

  it('should use Promises', async () => {
    let a = 1;
    new Promise((resolve) => setTimeout(resolve)).then(() => a++);
    // await vitest.runAllTimersAsync();
    await wait();
    expect(a).toBe(2);
  });

  it('should test Observable', async () => {
    let a = 1;
    const numbers$ = of(1, 2, 3).pipe(delay(0));

    new Observable<number>((subscriber) => {
      Promise.resolve().then(() => subscriber.next(1));
    }).subscribe((value) => {
      a += value;
      expect(a).toBe(2);
    });

    // await wait();
  });

  it('should test Observables', async () => {
    const a = 1;
    const numbers$ = of(1);
    const value = await lastValueFrom(numbers$);
  });

  describe('fakeTimers', () => {
    beforeEach(() => {
      vitest.useFakeTimers();
    });

    afterEach(() => {
      vitest.restoreAllMocks();
    });

    it('should use setTimeout', () => {
      let a = 1;
      setTimeout(() => {
        a++;
        setTimeout(() => {
          a++;
        }, 1000);
      }, 1000);
      vitest.advanceTimersByTime(1000);
      expect(a).toBe(2);

      vitest.advanceTimersByTime(1000);
      expect(a).toBe(3);
    });
  });
});
