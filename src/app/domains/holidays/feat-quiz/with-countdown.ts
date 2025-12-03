import {
  patchState,
  signalStoreFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { interval, tap } from 'rxjs';

export interface CountdownState {
  timeLeft: number;
  _timeInSeconds: number;
  _timeStarted: Date;
}

export function updateCountdown(timeInSeconds: number) {
  return {
    timeLeft: 0,
    _timeInSeconds: timeInSeconds,
    _timeStarted: new Date(),
  };
}

export function withCountdown<_>(timeInSeconds: number) {
  return signalStoreFeature(
    withState<CountdownState>({
      timeLeft: 0,
      _timeInSeconds: timeInSeconds,
      _timeStarted: new Date(),
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
