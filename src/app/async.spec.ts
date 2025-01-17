import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs';

class Incrementer {
  #a = 0;

  get a() {
    return this.#a;
  }

  increment() {
    setTimeout(() => {
      setTimeout(() => this.#a++, 9000);
    }, 1000);
  }
}

describe('async', () => {
  it('should use a Promise', () => {
    let a = 1;
    Promise.resolve().then(() => {
      a++;
      expect(a).toBe(2);
    });
  });

  it('should use a done callback', (done) => {
    let a = 1;
    Promise.resolve()
      .then(() => {
        a++;
        expect(a).toBe(2);
      })
      .then(done, done);
  });

  it('should use async/await', async () => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a++;
    });
    await promise;
    expect(a).toBe(2);
  });

  it('should use waitForAsync', waitForAsync(() => {
    let a = 1;
    Promise.resolve().then(() => {
      a += 1;
      expect(a).toBe(2);
    });
  }));

  it('should use setTimeout', () => {
    let a = 1;
    setTimeout(() => {
      a++;
      expect(a).toBe(2);
    });
  });

  it('should work', fakeAsync(() => {
    const incrementer = new Incrementer();
    incrementer.increment();
    tick(10 * 1000);
    expect(incrementer.a).toBe(1);
  }));

  it('should use an Observable', fakeAsync(() => {
    let a = 1;

    new Observable<number>((subscriber) => subscriber.next(1)).subscribe(
      (value) => {
        a += value;
        console.log(`innen ${a}`);
        expect(a).toBe(1);
      },
    );


    console.log(`aussen ${a}`);
    expect(a).toBe(2);
  }))
});
