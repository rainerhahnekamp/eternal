import {
  patchState,
  signalStoreFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap, interval } from 'rxjs';

export interface CountdownState {
  _timeInSeconds: number;
  _timeStarted: Date;
  timeLeft: number;
}

export function withCountdown(timeInSeconds: number) {
  return signalStoreFeature(
    withState<CountdownState>({
      _timeInSeconds: timeInSeconds,
      _timeStarted: new Date(),
      timeLeft: 0,
    }),
    withMethods((store) => ({
      _updateTimeLeft: rxMethod<unknown>(
        tap(() => {
          const timeLeft =
            store._timeInSeconds() -
            Math.floor(
              (new Date().getTime() - store._timeStarted().getTime()) / 1000,
            );
          patchState(store, { timeLeft });
        }),
      ),
    })),
    withHooks({
      onInit: (store) => {
        store._updateTimeLeft(interval(1000));
      },
    }),
  );
}
