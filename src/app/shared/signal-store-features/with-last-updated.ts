import { effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalStoreFeature,
  withHooks,
  withState,
} from '@ngrx/signals';
import { timer } from 'rxjs';

export function withLastUpdated(trackingSignal: () => void, interval = 1_000) {
  return signalStoreFeature(
    withState({
      _lastUpdated: Date.now(),
      lastUpdatedName: '',
    }),
    withHooks((store) => ({
      onInit() {
        effect(() => {
          trackingSignal();

          patchState(store, { _lastUpdated: Date.now() });
        });

        timer(0, interval)
          .pipe(takeUntilDestroyed())
          .subscribe(() =>
            patchState(store, ({ _lastUpdated }) => ({
              lastUpdatedName: calcTimeName(_lastUpdated),
            })),
          );
      },
    })),
  );
}

function calcTimeName(lastUpdated: number) {
  const now = Date.now();
  const seconds = Math.floor((now - lastUpdated) / 1000);

  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);

  return `${days} day${days > 1 ? 's' : ''} ago`;
}
