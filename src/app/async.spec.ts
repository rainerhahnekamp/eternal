import { fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

class Incrementer {
  #a = 1;

  get a() {
    return this.#a;
  }

  increment() {
    window.setTimeout(() => this.#a++, 1000 * 60 * 60);
  }
}

describe('Asynchronität', () => {
  it('should use setTimeout', waitForAsync(() => {
    let a = 1;
    setTimeout(() => {
      a += 1;
      expect(a).toBe(2);
    });
  }));

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

  it('should use resolve', () => {
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

  it('should test Incrementer', fakeAsync(async () => {
    const incrementer = new Incrementer();
    expect(incrementer.a).toBe(1);
    incrementer.increment();
    flush();
    await Promise.resolve();
  }));

  it('should use an interval', fakeAsync(() => {
    let a = 1;
    const intervalId = setInterval(() => {
      a++;
      clearInterval(intervalId);
    }, 1000);
    tick(1000);
    expect(a).toBe(2);
  }));

  it('should use an Observable', fakeAsync(() => {
    let a = 1;
    of(1)
      .subscribe((n) => (a += n));
    expect(a).toBe(2);
  }));

  it.skip('should use an Observable 2', waitForAsync(() => {
    let a = 1;
    of(1).subscribe((n) => {
      a += n;
      console.log(`inner ${a}`);
      expect(a).toBe(1);
    });

    console.log(`aussen ${a}`);
    expect(a).toBe(2);
  }));

  describe('native asynchronous tasks', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
    });

    it('should use setTimeout', () => {
      let a = 1;
      setTimeout(() => (a += 1), 60 * 60 * 1000);
      // jest.advanceTimersByTime(1000) = tick
      jest.runAllTimers(); // = flush
      expect(a).toBe(2);
    });
  });
});
