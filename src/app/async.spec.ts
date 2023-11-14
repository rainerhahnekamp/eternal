import { expect } from '@jest/globals';
import { fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { lastValueFrom, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { computed, signal } from '@angular/core';

class Incrementer {
  private _a = 1;

  get a() {
    return this._a;
  }

  increment() {
    window.setTimeout(() => this._a++, 3600 * 1000);
    window.setTimeout(() => (this._a += 10), 1500);
  }
}

describe('asynchrony', () => {
  it('should use setTimeout', () => {
    let a = 1;
    window.setTimeout(() => {
      a += 1;
      expect(a).toBe(2);
    });
  });

  // FIXME
  it('should use a Promise', fakeAsync(() => {
    let a = 1;
    Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(1);
    });
  }));

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

  it('should use the resolves property', () => {
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

  it('should test the incrementer', fakeAsync(() => {
    const incrementer = new Incrementer();
    expect(incrementer.a).toBe(1);
    incrementer.increment();

    flush();
    expect(incrementer.a).toBe(12);
  }));

  it('should use flush on interval', fakeAsync(() => {
    let a = 1;
    const intervalId = window.setInterval(() => {
      a += 1;
      clearInterval(intervalId);
    }, 1000);

    tick(1000);
    expect(a).toBe(2);
  }));

  it('should use an observable with timeout', fakeAsync(() => {
    let a = 1;
    of(1)
      .pipe(delay(1000))
      .subscribe((value) => (a += value));
    tick(1000);
    expect(a).toBe(2);
  }));

  it('should use an observable', waitForAsync(() => {
    let a = 1;
    of(1).subscribe((value) => {
      a += value;
      console.log(`inner: ${a}`);
      expect(a).toBe(2);
    });

    console.log(`outer: ${a}`);
    expect(a).toBe(2);
  }));

  it('should use a Promise for an Observable', waitForAsync(async () => {
    let a = 1;
    const value = await lastValueFrom(of(1));
    a += value;
    expect(a).toBe(2)
  }));

  it('should test a signal', waitForAsync( () => {
    const a = signal(1);
    const multiplier=  computed(() => a() * a())

    expect(multiplier()).toBe(1)
    a.update(value => value + 1)
    expect(multiplier()).toBe(4)
  }));
});
