import { expect } from '@jest/globals';
import { waitForAsync } from '@angular/core/testing';

class Incrementer {
  #a = 1;

  get a() {
    return this.#a;
  }

  increment() {
    setTimeout(() => setTimeout(() => this.#a++, 1000 * 1500), 1000 * 1500);
  }
}

describe('asynchronous tests', () => {
  it('should use setTimeout', () => {
    let a = 1;
    setTimeout(() => {
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

  it('should return a Promise', async () => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a += 1;
      return a;
    });

    expect(await promise).toBe(2);
  });

  it('should be very simple', waitForAsync(() => {
    expect(true).toBe(true);
  }));

  it('should test Incrementer', async () => {
    jest.useFakeTimers();
    let a = 1;

    Promise.resolve().then(() => {
      a += 1;
    });

    await jest.runAllTimersAsync();
    expect(a).toBe(2);

    jest.useRealTimers();
  });
});
