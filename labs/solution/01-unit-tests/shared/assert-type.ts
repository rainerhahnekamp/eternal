export function assertType<T>(object: unknown = undefined): T {
  return object as T;
}
