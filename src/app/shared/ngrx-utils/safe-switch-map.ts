import { Action } from '@ngrx/store';
import { catchError, Observable, of, OperatorFunction, switchMap } from 'rxjs';
import { noopAction } from './noop.action';

export function safeSwitchMap<S, T extends string, U extends string>(
  project: (value: S) => Observable<Action<T>>,
  errorAction?: (err: Error) => Action<U>,
): OperatorFunction<S, Action<T | U | '[Util] NOOP'>> {
  return (source$: Observable<S>): Observable<Action<T | U | '[Util] NOOP'>> =>
    source$.pipe(
      switchMap((value) =>
        project(value).pipe(
          catchError((err) => of(errorAction?.(err) ?? noopAction())),
        ),
      ),
    );
}
