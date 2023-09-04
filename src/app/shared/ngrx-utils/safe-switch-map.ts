import { TypedAction } from '@ngrx/store/src/models';
import { catchError, Observable, of, OperatorFunction, switchMap } from 'rxjs';
import { noopAction } from './noop.action';

export function safeSwitchMap<S, T extends string, U extends string>(
  project: (value: S) => Observable<TypedAction<T>>,
  errorAction?: (err: Error) => TypedAction<U>
): OperatorFunction<S, TypedAction<T | U | '[Util] NOOP'>> {
  return (
    source$: Observable<S>
  ): Observable<TypedAction<T | U | '[Util] NOOP'>> =>
    source$.pipe(
      switchMap((value) =>
        project(value).pipe(
          catchError((err) => of(errorAction?.(err) ?? noopAction()))
        )
      )
    );
}
