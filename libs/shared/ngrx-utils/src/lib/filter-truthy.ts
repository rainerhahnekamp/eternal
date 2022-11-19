import { filter, Observable } from 'rxjs';

export function filterTruthy<T>(source$: Observable<T>): Observable<T> {
  return source$.pipe(filter(Boolean));
}
