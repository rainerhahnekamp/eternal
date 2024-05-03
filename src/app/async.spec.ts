import { expect } from '@jest/globals';
import { fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { asyncScheduler, lastValueFrom, of, scheduled } from "rxjs";

class Incrementer {
  #a = 1;

  get a() {
    return this.#a;
  }

  increment() {
    window.setTimeout(() => this.#a++, 1000 * 3600);
  }
}

describe('Asynchronität', () => {
  it('should use a Promise', () => {
    let a = 1;
    Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('use a done callback', (done) => {
    let a = 1;
    Promise.resolve()
      .then(() => {
        a += 1;
        expect(a).toBe(2);
      })
      .then(done, done);
  });

  it('should return a Promise', () => {
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

  it('should async/await', async () => {
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

  it('should test incrementer', fakeAsync(() => {
    const incrementer = new Incrementer();
    expect(incrementer.a).toBe(1);
    incrementer.increment();
    flush();
    expect(incrementer.a).toBe(2);
  }));

  it('should use a setInterval', fakeAsync(() => {
    let a = 1;
    const intervalId = setInterval(() => {
      a++;
      clearInterval(intervalId);
    }, 1000);

    tick(1000);
    // flush()
  }));

  it('should use an Observable', fakeAsync(() => {
    let a = 1;
    scheduled([1], asyncScheduler).subscribe((n) => (a += n));
    tick()
    expect(a).toBe(2)
  }));

  it('should use an Observable with waitForAsync', waitForAsync(async () => {
    let a = 1;
    a += await lastValueFrom(scheduled([1], asyncScheduler))
    expect(a).toBe(2)
  }));
});
