import './deep-clone.d';
import structuredClone from '@ungap/structured-clone';
import { map, Observable } from 'rxjs';

export function deepClone<T>(source$: Observable<T>): Observable<T> {
  return source$.pipe(map((object) => structuredClone(object)));
}
