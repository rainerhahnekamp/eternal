import {
  patchState,
  signalStoreFeature,
  type,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { interval, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';

export function withCountdown<_>() {
  return signalStoreFeature(
    { state: type<{ timeInSeconds: number }>() },
    withState({
      timeStarted: new Date(),
      timeLeft: 0,
    }),
    withMethods((store) => ({
      _updateTimeLeft: rxMethod<unknown>(
        pipe(
          tap(() => {
            patchState(store, {
              timeLeft:
                store.timeInSeconds() -
                Math.floor(
                  (new Date().getTime() - store.timeStarted().getTime()) / 1000,
                ),
            });
          }),
        ),
      ),
    })),
    withHooks((store) => ({
      onInit() {
        store._updateTimeLeft(interval(1000));
      },
    })),
  );
}
