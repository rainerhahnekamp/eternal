import { expect } from '@jest/globals';
import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

class Incrementer {
  private _a = 0;
  get a() {
    return this._a;
  }

  increment() {
    window.setTimeout(
      () =>
        window.setTimeout(() => {
          this._a++;
        }, 1000),
      1000 * 3600,
    );
  }
}

describe('Asynchrony', () => {
  it('should use a timeout', () => {
    let a = 1;
    window.setTimeout(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  it('should use a timeout', () => {
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

  it('should return a Promise in the form of an expect', () => {
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

  it('should use async/await', waitForAsync(() => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  }));

  it('should test incrementer', fakeAsync(() => {
    let a = 1;
    const intervalId = window.setInterval(() => {
      a += 1;
      clearInterval(intervalId);
    }, 1000);

    tick(1000);

    expect(a).toBe(2);
  }));

  it('should use RxJs', waitForAsync(() => {
    let a = 1;
    of(1).subscribe((value) => {
      a += value;
      console.log('inner' + a);
      expect(a).toBe(1);
    });
    console.log('outer' + a);
    expect(a).toBe(2);
  }));
});
