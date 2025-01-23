import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';

export function withFavourites<_>() {
  return signalStoreFeature(
    { props: type<{ url: string; httpClient: HttpClient }>() },
    withState({ favouriteIds: [] as number[] }),
    withMethods((store) => ({
      addFavourite(id: number) {
        if (store.favouriteIds().includes(id)) {
          return;
        }

        patchState(store, (value) => ({
          favouriteIds: [...value.favouriteIds, id],
        }));

        store.httpClient.post(store.url, store.favouriteIds());
      },

      removeFavourite(id: number) {
        patchState(store, (value) => ({
          favouriteIds: value.favouriteIds.filter(
            (favouriteId) => favouriteId !== id,
          ),
        }));
      },
    })),
  );
}
