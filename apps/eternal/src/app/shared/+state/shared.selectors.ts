import { createSelector } from '@ngrx/store';
import { sharedFeature } from './shared.reducer';

const { selectActiveHttpRequest, selectUser, selectLoaded } = sharedFeature;

const selectSignedIn = createSelector(
  selectUser,
  selectLoaded,
  (user, loaded) => loaded && !user?.anonymous
);

export const fromShared = {
  selectUser,
  selectLoaded,
  selectSignedIn,
  selectActiveHttpRequest
};
