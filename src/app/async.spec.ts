import { expect, describe, it } from 'vitest';

describe('async', () => {
  it('should use setTimeout', () => {
    let a = 1;
    setTimeout(() => {
      a++;
      expect(a).toBe(1);
    });
  });

  it('should use a Promise', async () => {
    const a = 1;
    const promise = Promise.resolve().then(() => {
      return a + 1;
    });

    expect(await promise).toBe(2);
  });
});
