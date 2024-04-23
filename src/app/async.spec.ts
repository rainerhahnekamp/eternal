import { describe, expect } from '@jest/globals';
import {
  fakeAsync,
  flush,
  flushMicrotasks,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  asapScheduler,
  asyncScheduler,
  lastValueFrom,
  of,
  scheduled,
  startWith,
} from 'rxjs';
import { delay } from 'rxjs/operators';

describe('Asynchrony', () => {
  it('should use Promise', () => {
    let a = 1;
    Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(1);
    });
  });

  it('should use the done callback', (done) => {
    let a = 1;
    Promise.resolve()
      .then(() => {
        a += 1;
        expect(a).toBe(2);
      })
      .then(done, done);
  });

  it('should return the Promise', () => {
    let a = 1;
    return Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('should use resolves', () => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a += 1;
      return a;
    });

    return expect(promise).resolves.toBe(2);
  });

  it('should use async/await', async () => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a += 1;
      return a;
    });

    expect(await promise).toBe(2);
  });

  it('should use waitForAsync', waitForAsync(() => {
    let a = 1;
    Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  }));

  it('should use window.setTimeout', () => {
    let a = 1;
    window.setTimeout(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('should use fakeAsync', fakeAsync(() => {
    let a = 1;

    of(1)
      .pipe(delay(0))
      .subscribe((n) => (a += n));

    tick();
    expect(a).toBe(2);
  }));

  it('should use an Observable', waitForAsync(async () => {
    const numbers$ = scheduled([10], asyncScheduler);
    const number = await lastValueFrom(numbers$);
    expect(number).toBe(10);
  }));

  it('should use an Observable with fakeAsync', fakeAsync(() => {
    const numbers$ = scheduled([10], asyncScheduler);
    numbers$.subscribe((value) => {
      expect(value).toBe(10);
    });
    // tick();
  }));

  it('should use RxJs with synchronous observable', waitForAsync( () => {
    let a = 0;
    of(1).subscribe((n) => {
      a += n;
      expect(a).toBe(0);
    });
  }));
});
