import { signalStore, withHooks } from '@ngrx/signals';
import { withProfiler } from '../../../../shared/signal-store-features/with-profiler';
import { withHolidaysStoreBase } from './with-holidays-store-base';
import { withHolidaysStoreComputed } from './with-holidays-store-computed';
import { withHolidaysStoreMethods } from './with-holidays-store-methods';

export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withHolidaysStoreBase(),
  withHolidaysStoreMethods(),
  withHolidaysStoreComputed(),
  withProfiler(),
  withHooks((store) => ({
    onInit() {
      store.setUser('Rainer Hahnekamp');
      if (!store.isLoaded()) {
        store._load();
      }
    },
  })),
);
