import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';

describe('asynchronous tasks', () => {
  it('should use waitForAsync', waitForAsync(() => {
    expect(true).toBe(true);
  }));

  it('should increment a', fakeAsync(() => {
    let a = 1;
    setTimeout(() => {
      a += 1;
    }, 1500);

    expect(a).toBe(1);
  }));
});
