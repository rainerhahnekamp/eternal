import { asyncScheduler, lastValueFrom, scheduled } from 'rxjs';

it('should work with Promises', async () => {
  jest.useFakeTimers();
  let a = 1;

  const promise = lastValueFrom(scheduled([2], asyncScheduler)).then(
    (value) => (a += value),
  );

  await jest.runAllTimersAsync();

  expect(a).toBe(3);
});
