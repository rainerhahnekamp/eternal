import { fakeAsync, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';

describe('Async Tests', () => {
  describe('with zone.js - Legacy', () => {
    it('should sum two numbers asynchronously (Promise & setTimeout)', fakeAsync(() => {
      let a = 1;

      Promise.resolve().then(() => {
        setTimeout(() => {
          a += 1;
        }, 6000);
      });

      setTimeout(() => {
        setTimeout(() => (a += 1), 1000);
      }, 1000);

      tick(6000);

      expect(a).toBe(3);
    }));
  });

  describe('without zone.js - Modern', () => {
    let clock: jasmine.Clock;

    async function wait(ms = 0) {
      await Promise.resolve();
      clock.tick(ms);
    }

    beforeEach(() => {
      clock = jasmine.clock().install();
    });

    afterEach(() => {
      clock.uninstall();
    });

    it('should sum two numbers asynchronously', () => {
      let a = 1;
      setTimeout(() => {
        a += 1;
      }, 10000);

      setTimeout(() => {
        a += 1;
      }, 5000);

      clock.tick(5000);
      expect(a).toBe(2);

      clock.tick(5000);
      expect(a).toBe(3);
    });

    it('should sum two numbers asynchronously (Promise & setTimeout)', async () => {
      let a = 1;

      Promise.resolve().then(() => setTimeout(() => (a += 1), 5000));

      await wait(5000);

      expect(a).toBe(2);
    });

    it('should handle two numbers via a Promise', async () => {
      let a = 1;
      const promise = Promise.resolve().then(() => {
        a += 1;
        return a;
      });

      expect(await promise).toBe(2);
    });

    it('should test an Observable', async () => {
      let a = 1;
      const numbers$ = new Observable<number>((subscriber) => {
        subscriber.next(1);

        Promise.resolve().then(() => {
          subscriber.next(2);
        });

        setTimeout(() => {
          subscriber.next(3);
        }, 1000);
      });
      numbers$.subscribe((n) => (a += n));
      expect(a).toBe(2);

      await wait();
      expect(a).toBe(4);

      await wait(1000);
      expect(a).toBe(7);
    });
  });
});
