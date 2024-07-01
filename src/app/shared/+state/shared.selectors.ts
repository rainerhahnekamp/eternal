import { sharedFeature } from './shared.reducer';

const { selectActiveHttpRequest } = sharedFeature;

export const fromShared = {
  selectActiveHttpRequest
};
