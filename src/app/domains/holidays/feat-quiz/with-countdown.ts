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
  timeInSeconds: number;
  timeStarted: Date;
  timeLeft: number;
}

export function withCountdown(timeInSeconds: number) {
  return signalStoreFeature(
    withState<CountdownState>({
      timeInSeconds,
      timeStarted: new Date(),
      timeLeft: timeInSeconds,
    }),
    withMethods((store) => ({
      updateTimeLeft: rxMethod<unknown>(
        tap(() => {
          const timeLeft =
            store.timeInSeconds() -
            Math.floor(
              (new Date().getTime() - store.timeStarted().getTime()) / 1000,
            );
          patchState(store, { timeLeft });
        }),
      ),
    })),
    withHooks({
      onInit: (store) => {
        store.updateTimeLeft(interval(1000));
      },
    }),
  );
}
