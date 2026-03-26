import { fakeAsync, flush } from "@angular/core/testing";

describe('Asynchronität', () => {
  it('should use a timeout', async () => {
    let a = 1;
    setTimeout(() => {
      a++;
    })

    await expect.poll(() => a).toBe(2);
  })

  it('should use a Promise', async () => {
    let a = 1;
    await Promise.resolve().then(() => {
      a++;
    })
    await expect.poll(() => a).toBe(2);
  })
})