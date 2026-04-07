import { signalStore, withHooks } from '@ngrx/signals';
import { withProfiler } from '../../../../../shared/signal-store-features/with-profiler';
import { withHolidaysStoreComputed as withHolidaysStoreBody } from './3-with-holidays-store-computed';

export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withHolidaysStoreBody(),
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
