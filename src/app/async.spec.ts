import { fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

class Incrementer {
  #a = 1;

  get a() {
    return this.#a;
  }

  increment() {
    setTimeout(() => (this.#a += 1), 1000);
  }
}

describe('async tasks', () => {
  it('should add 1 + 1 by Promise', () => {
    let a = 1;
    Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('should add 1 + 1 by done callback', (done) => {
    let a = 1;
    Promise.resolve()
      .then(() => {
        a += 1;
        expect(a).toBe(2);
      })
      .then(done, done);
  });

  it('return should add 1 + 1 a Promise', () => {
    let a = 1;
    return Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('return should resolves', () => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a += 1;
      return a;
    });

    return expect(promise).resolves.toBe(2);
  });

  it('return should resolves', async () => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a += 1;
      return a;
    });

    expect(await promise).toBe(2);
  });

  it('should add 1 + 1', () => {
    let a = 1;
    window.setTimeout(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('return should use waitForAsync', waitForAsync(() => {
    expect(true).toBe(true);
  }));

  it('should test the Incrementer', fakeAsync(() => {
    const incrementer = new Incrementer();
    expect(incrementer.a).toBe(1);
    incrementer.increment();
    // tick(1000)
    flush();
    expect(incrementer.a).toBe(2);
  }));

  it('should use a setInterval', fakeAsync(
    () => {
      let a = 1;

      const intervalId = setInterval(() => {
        a += 1;
        clearInterval(intervalId);
      }, 1000);

      tick(1000);
      expect(a).toBe(2);
    },
    { flush: false },
  ));

  it('should test a Observable', waitForAsync(() => {
    let a = 1;
    of(1).subscribe({
      next: (value) => {
        a += value;
        console.log(`inner: ${a}`);
        expect(a).toBe(2);
      },
      error: () => console.log('error has happened'),
    });

    console.log(`outer: ${a}`);
    expect(a).toBe(2);
  }));

  describe('fake timers', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should add 1 + 1', () => {
      let a = 1;
      window.setTimeout(() => (a += 1));
      jest.runAllTimers();
      expect(a).toBe(2);
    });
  });
});
