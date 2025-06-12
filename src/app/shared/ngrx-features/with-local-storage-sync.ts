import {
  getState,
  patchState,
  signalStoreFeature,
  watchState,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';

export function withLocalStorageSync(key: string, autoSync = true) {
  return signalStoreFeature(
    withComputed(() => ({
      prettySearch: () => '',
    })),
    withMethods((store) => {
      return {
        syncFromStorage() {
          // FIXME
          // patchState(store, { key: 'xyz' });
          const data = localStorage.getItem(key);
          if (data === null) {
            return;
          }

          patchState(store, JSON.parse(data));
        },
        syncToStorage() {
          const state = getState(store);
          const data = JSON.stringify(state);
          localStorage.setItem(key, data);
        },
      };
    }),
    withHooks((store) => ({
      onInit() {
        if (!autoSync) {
          return;
        }

        store.syncFromStorage();

        watchState(store, (state) => store.syncToStorage());
      },
    })),
  );
}
