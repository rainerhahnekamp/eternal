import { signalStoreFeature, withState } from '@ngrx/signals';

export function withFavourites() {
  return signalStoreFeature(
    withState({
      _favouriteIds: new Array<number>(),
    }),
  );
}

interface FavouritesState {
  _favouriteIds: number[];
}

export function addFavourite(id: number) {
  return (state: FavouritesState) => ({
    _favouriteIds: [...state._favouriteIds, id],
  });
}

export function removeFavourite(id: number) {
  return (state: FavouritesState) => ({
    _favouriteIds: state._favouriteIds.filter(
      (favouriteId) => favouriteId !== id,
    ),
  });
}
