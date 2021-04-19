import { createAction, props } from '@ngrx/store';
import { User } from './shared.reducer';

const loadUser = createAction('[Shared] Load User');
const loadUserSuccess = createAction('[Shared] User Loaded', props<{ user: User }>());
const signInUser = createAction(
  '[Shared] Sign-In User',
  props<{ email: string; password: string }>()
);
const signInUserSuccess = createAction('[Shared] Sign-In User Success', props<{ user: User }>());
const signOutUser = createAction('[Shared] Sign-Out User');
const signOutUserSuccess = createAction('[Shared] Sign-Out User Success', props<{ user: User }>());

const httpRequestStarted = createAction('[Shared] Http Request Started');
const httpRequestEnded = createAction('[Shared] Http Request Ended');

export const sharedActions = {
  loadUser,
  loadUserSuccess,
  signInUser,
  signInUserSuccess,
  signOutUser,
  signOutUserSuccess,
  httpRequestStarted,
  httpRequestEnded
};
