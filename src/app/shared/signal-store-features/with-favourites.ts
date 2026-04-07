import { signalStoreFeature, withState } from '@ngrx/signals';
import { SignalStoreFeatureType } from '../util/signal-store-feature-type';

export function withFavourites() {
  return signalStoreFeature(
    withState({
      _favouriteIds: new Array<number>(),
    }),
  );
}

export interface FavouritesState {
  _favouriteIds: number[];
}

export type FavouritesFeature = SignalStoreFeatureType<typeof withFavourites>;

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
