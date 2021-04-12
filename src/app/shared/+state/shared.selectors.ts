import { createFeatureSelector, createSelector } from '@ngrx/store';
import { sharedFeatureKey, SharedReducer } from './shared.reducer';

const featureSelector = createFeatureSelector<SharedReducer>(sharedFeatureKey);

const selectUser = createSelector(featureSelector, ({ user }) => user);
const selectLoaded = createSelector(featureSelector, ({ loaded }) => loaded);

const selectSignedIn = createSelector(
  selectUser,
  selectLoaded,
  (user, loaded) => loaded && !user?.anonymous
);

export const fromShared = {
  selectUser,
  selectLoaded,
  selectSignedIn
};
