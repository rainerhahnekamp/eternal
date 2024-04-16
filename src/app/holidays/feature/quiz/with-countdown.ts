import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { interval, pipe, startWith } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const withCountdown = function () {
  return signalStoreFeature(
    withState({ timeLeft: 0, timeStarted: new Date(), timeInSeconds: 0 }),
    withMethods((store) => {
      const isServer = isPlatformServer(inject(PLATFORM_ID));
      const updateTimeLeft = rxMethod<unknown>(
        pipe(
          tap(() =>
            patchState(store, {
              timeLeft:
                store.timeInSeconds() -
                Math.floor(
                  (new Date().getTime() - store.timeStarted().getTime()) / 1000,
                ),
            }),
          ),
        ),
      );

      return {
        startCountdown(timeInSeconds: number) {
          if (isServer) {
            return;
          }
          patchState(store, {
            timeInSeconds,
            timeStarted: new Date(),
          });
          updateTimeLeft(interval(1000).pipe(startWith(0)));
        },
      };
    }),
  );
};
