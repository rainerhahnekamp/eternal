import { expect } from '@jest/globals';
import { fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { lastValueFrom, of } from 'rxjs';
import { effect, signal } from '@angular/core';

describe('Playground for asynchronous tasks', () => {
  it('should use a timeout', () => {
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
      expect(a).toBe(1);
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

  it('should return Promise', () => {
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

  it('should use async / await', async () => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a += 1;
      return a;
    });

    expect(await promise).toBe(2);
  });

  it('should use waitForAsync', waitForAsync(() => {
    expect(true).toBe(true);
  }));

  it('should use fakeAsync', fakeAsync(() => {
    let a = 1;
    setTimeout(() => {
      a += 1;
    }, 1000);

    setTimeout(() => {
      a += 10;
    }, 10000);

    setTimeout(() => {
      a += 100;
    }, 100000);

    flush();
    expect(a).toBe(112);
  }));

  it('should use Rxjs', async () => {
    let a = 1;
    a += await lastValueFrom(of(1));
    expect(a).toBe(2);
  });

  it('should use Signals', () => {
    const a = signal(1);
    let double = 0;

    let effectCounter = 0;

    a.update((value) => value + 1);

    TestBed.runInInjectionContext(() => {
      effect(() => {
        double = a() * 2;
        effectCounter++;
      });

      TestBed.flushEffects();
      expect(double).toBe(4);
      expect(effectCounter).toBe(1);

      TestBed.flushEffects();
      TestBed.flushEffects();
      TestBed.flushEffects();
      TestBed.flushEffects();
      TestBed.flushEffects();
      TestBed.flushEffects();
      expect(double).toBe(4);
      expect(effectCounter).toBe(1);

      a.set(10);
      TestBed.flushEffects();
      expect(double).toBe(20);
      expect(effectCounter).toBe(2);
    });
  });
});
