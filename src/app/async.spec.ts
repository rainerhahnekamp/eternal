import { describe, it, expect } from 'vitest';

const wait = (timeout = 0) => new Promise((resolve) => setTimeout(resolve));

describe.skip('basic', () => {
  it('should work', async () => {
    let a = 1;

    setTimeout(() => {
      Promise.resolve().then(() => {
        Promise.resolve().then(() => a++);
      });
    }, 20_000);

    // await wait();
    await expect.poll(() => a).toBe(2);
  });

  it('should use Promises', async () => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a++;
      return a;
    });
    expect(await promise).toBe(2);
  });
});
