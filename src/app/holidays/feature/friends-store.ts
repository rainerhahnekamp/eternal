import { signalStore, withState } from '@ngrx/signals';
import { withFavourites } from './holidays/with-favourites';

export const FriendsStore = signalStore(
  withState({ friends: [] }),
  withFavourites(),
);

const friendStore = new FriendsStore();
