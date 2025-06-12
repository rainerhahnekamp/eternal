import {
  patchState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

interface FavouritesState {
  favouriteIds: number[];
}

export function withFavourites() {
  return signalStoreFeature(
    withState<FavouritesState>({ favouriteIds: [] }),
    withMethods((store) => {
      const resetFavourites = () => patchState(store, { favouriteIds: [] });
      return {
        resetFavourites,
        addFavourite(id: number): void {
          patchState(store, ({ favouriteIds }) => ({
            favouriteIds: [...favouriteIds, id],
          }));
        },

        removeFavourite(id: number): void {
          patchState(store, ({ favouriteIds }) => ({
            favouriteIds: favouriteIds.filter(
              (favouriteId) => favouriteId !== id,
            ),
          }));
        },
      };
    }),
  );
}
