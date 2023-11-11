import { sharedFeature } from './sharedState';

const { selectActiveHttpRequest } = sharedFeature;

export const fromShared = {
  selectActiveHttpRequest,
};
