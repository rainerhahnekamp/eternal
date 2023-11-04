import { expect } from '@jest/globals';
import { fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { delay } from 'rxjs/operators';
import { asapScheduler, of, scheduled } from 'rxjs';

class Incrementer {
  private _a = 0;
  get a() {
    return this._a;
  }

  increment() {
    window.setTimeout(() => this._a++, 3600 * 1000);
  }
}

describe('Asychronity', () => {
  it('should use a timeout', () => {
    let a = 1;
    window.setTimeout(() => {
      a++;
      expect(a).toBe(2);
    });
  });

  it('should use a Promise', () => {
    let a = 1;
    Promise.resolve().then(() => {
      a++;
      expect(a).toBe(2);
    });
  });

  it('should use the done callback', (done) => {
    let a = 1;
    Promise.resolve()
      .then(() => {
        a++;
        expect(a).toBe(2);
      })
      .then(done, done);
  });

  it('should use the resolve property', () => {
    let a = 1;
    return Promise.resolve().then(() => {
      a++;
      expect(a).toBe(2);
    });
  });

  it('should use async/await', async () => {
    let a = 1;
    await Promise.resolve().then(() => {
      a++;
      expect(a).toBe(2);
    });
  });

  it('should use waitForAsync', waitForAsync(() => {
    let a = 1;
    Promise.resolve().then(() => {
      a++;
      expect(a).toBe(2);
    });
  }));

  it('should test incrementer', fakeAsync(async () => {
    let a = 1;
    new Promise((resolve) => {
      window.setTimeout(() => {
        a++;
        resolve(a);
      });
      tick();
    });
    expect(a).toBe(2);
  }));

  it('should use flush', fakeAsync(() => {
    const incrementer = new Incrementer();
    incrementer.increment();
    flush();
    expect(incrementer.a).toBe(1);
  }));

  it('should use flush with setInterval', fakeAsync(() => {
    let a = 1;

    of(1, 2, 3, 4)
      .pipe(delay(100))
      .subscribe((value) => (a += value));
    tick(100);
    expect(a).toBe(11);
  }));

  it('should use RxJs', waitForAsync(() => {
    let a = 1;
    scheduled([1], asapScheduler).subscribe((value) => {
      a += value;
      expect(a).toBe(2);
    });
  }));
});
