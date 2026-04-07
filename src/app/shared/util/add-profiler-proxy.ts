export function addProfilerProxy<FN extends Function>(
  fn: FN,
  name: string,
): FN {
  return new Proxy(fn, {
    apply(target, thisArg, argArray: unknown[]) {
      const startedAt = performance.now();

      const result = Reflect.apply(target, thisArg, argArray);
      const end = performance.now();
      const duration = end - startedAt;

      console.group('profiler', String(name));
      console.info(
        `Start: ${new Date(performance.timeOrigin + startedAt).toLocaleTimeString()}`,
      );
      console.info(
        `End: ${new Date(performance.timeOrigin + end).toLocaleTimeString()}`,
      );
      console.info(`Duration: ${duration}ms`);
      console.log('Parameters: %o', argArray);
      console.info('Returned: %o', result);
      console.groupEnd();

      return result;
    },
  });
}
