import {
  fakeAsync,
  flush,
  flushMicrotasks,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

class Incrementer {
  private _a = 1;

  get a() {
    return this._a;
  }

  increment() {
    window.setTimeout(() => this._a++, 1000 * 60 * 60);
  }
}

describe('Asynchrony', () => {
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

  it('should use resolves of expect', () => {
    const a = 1;

    const promise = Promise.resolve().then(() => {
      return a + 1;
    });

    return expect(promise).resolves.toBe(2);
  });

  it('should use async/await', async () => {
    const a = 1;

    const promise = Promise.resolve().then(() => {
      return a + 1;
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
    expect(incrementer.a).toBe(2);
  }));

  it('should use RxJs with delay', fakeAsync(() => {
    let a = 1;
    const n$ = of(1).pipe(delay(0));

    n$.subscribe((value) => (a += value));
    tick();

    expect(a).toBe(2);
  }));

  it('should use multiple asynchronous tasks', fakeAsync(() => {
    let a = 1;
    window.setTimeout(() => {
      // console.log('Macrotask');
      return a++;
    }); // Macrotask
    window.setTimeout(() => {
      // console.log('Longer Macrotask');
      return (a += 10);
    }, 1000); // Macrotask
    Promise.resolve().then(() => {
      // console.log('Promise');
      return (a += 100);
    }); // Microtask

    flushMicrotasks();
    expect(a).toBe(101);

    tick();
    expect(a).toBe(102);

    flush();
  }));

  it('should use RxJs without asynchrony', waitForAsync(() => {
    let a = 1;
    of(1).subscribe((n) => {
      a += n;
      console.log('inner ' + a);
      expect(a).toBe(2);
    });

    console.log('outer ' + a);
    expect(a).toBe(2);
  }));

  it('should add 1 + 1', waitForAsync(() => {
    expect(1 + 1).toBe(2);
  }));
});
