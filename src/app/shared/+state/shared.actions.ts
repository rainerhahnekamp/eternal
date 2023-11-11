import { createAction } from '@ngrx/store';

const httpRequestStarted = createAction('[Shared] Http Request Started');
const httpRequestEnded = createAction('[Shared] Http Request Ended');

export const sharedActions = {
  httpRequestStarted,
  httpRequestEnded,
};
