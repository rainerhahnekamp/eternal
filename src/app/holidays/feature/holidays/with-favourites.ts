import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';

export function withFavourites<_>() {
  return signalStoreFeature(
    { state: type<{ _favouriteIds: number[] }>() },
    withMethods((store) => ({
      addFavourite(id: number) {
        if (store._favouriteIds().includes(id)) {
          return;
        }

        patchState(store, { _favouriteIds: [...store._favouriteIds(), id] });
      },

      removeFavourite(id: number) {
        if (!store._favouriteIds().includes(id)) {
          return;
        }

        patchState(store, {
          _favouriteIds: store._favouriteIds().filter((i) => i !== id),
        });
      },
    })),
  );
}
