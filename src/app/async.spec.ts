import { fakeAsync, flush, waitForAsync } from "@angular/core/testing";

class DataIncrementer {
  #a = 1;

  get a() {
    return this.#a
  }

  increment() {
    setTimeout(() => this.#a++, 1000 * 3600)
  }
}

describe('Async Playground', () => {
  it('should use a Promise', () => {
    let a = 1;
    Promise.resolve().then(() => {
      a++;
      expect(a).toBe(1);
    });
  });

  it('should use the done callback', (done) => {
    let a = 1;
    Promise.resolve()
      .then(() => {
        a++;
        expect(a).toBe(2);
      })
      .then(done, done);
  });

  it('should return a Promise', () => {
    let a = 1;
    return Promise.resolve().then(() => {
      a++;
      expect(a).toBe(2);
    });
  });

  it('should use resolves', () => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a++;
      return a;
    });

    return expect(promise).resolves.toBe(2);
  });

  it('should use async/await', async () => {
    let a = 1;
    const promise = Promise.resolve().then(() => {
      a++;
      return a;
    });

    expect(await promise).toBe(2);
  });

  it('should use a timeout', () => {
    let a = 1;

    setTimeout(() => {
      a++;
      expect(a).toBe(2);
    });
  });

  it('should use waitForAsync', waitForAsync(() => {
    let a = 1;
    Promise.resolve().then(() => {
      a++;
      expect(a).toBe(2);
    });
  }));

  it('should test DataIncrementer', fakeAsync(() => {
    const incrementer = new DataIncrementer();
    expect(incrementer.a).toBe(1)
    incrementer.increment();
    flush()
    expect(incrementer.a).toBe(2)
  }))

  describe('fake timers', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(async () => {
      await jest.runAllTimersAsync()
      jest.useRealTimers()
    })

    it('should use setTimeout', async () => {
      const incrementer = new DataIncrementer();
      expect(incrementer.a).toBe(1)
      incrementer.increment()
      jest.runAllTimers()
      expect(incrementer.a).toBe(2)
    })

    it('should use a Promise', async () => {
      let a = 1;
      Promise.resolve().then(() => {
        a++
      })

      await jest.runAllTimersAsync()
      expect(a).toBe(2)
    })
  })
});
