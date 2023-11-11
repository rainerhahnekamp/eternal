import { createSelector } from '@ngrx/store';
import { securityFeature } from './security.reducer';

const { selectUser, selectLoaded } = securityFeature;

const selectLoadedUser = createSelector(
  selectUser,
  selectLoaded,
  (user, loaded) => (loaded ? user : undefined),
);

const selectSignedIn = createSelector(
  selectUser,
  selectLoaded,
  (user, loaded) => loaded && !user?.anonymous,
);

export const fromSecurity = {
  selectUser,
  selectLoaded,
  selectLoadedUser,
  selectSignedIn,
};
