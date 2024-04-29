import { fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { asyncScheduler, lastValueFrom, scheduled } from 'rxjs';

class Incrementer {
  #a = 1;

  get a() {
    return this.#a;
  }

  increment() {
    window.setTimeout(() => (this.#a += 1), 3600 * 1000);
    window.setTimeout(() => (this.#a += 100), 2000);
    window.setTimeout(() => (this.#a += 10), 1000);
  }
}

describe('Asynchronität', () => {
  it('should use window.setTimeout', () => {
    let a = 1;
    window.setTimeout(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('should use a Promise', () => {
    let a = 1;
    Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('should use a done callback', (done) => {
    let a = 1;
    Promise.resolve()
      .then(() => {
        a += 1;
        expect(a).toBe(2); // throws JestAssertionError
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

  it('should test incrementer', fakeAsync(() => {
    const incrementer = new Incrementer();
    expect(incrementer.a).toBe(1);
    incrementer.increment();
    flush();
    expect(incrementer.a).toBe(112);
  }));

  it('should use an asynchronous Observable', fakeAsync(() => {
    let a = 1;
    scheduled([1], asyncScheduler).subscribe((n) => (a += n));
    tick();
    expect(a).toBe(2);
  }));

  it('should use an asynchronous Observable with waitForAsync', waitForAsync(async () => {
    let a = 1;
    a += await lastValueFrom(scheduled([1], asyncScheduler));
    expect(a).toBe(2);
  }));
});
