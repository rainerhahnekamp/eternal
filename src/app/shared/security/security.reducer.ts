import { createFeature, createReducer, on } from '@ngrx/store';
import { securityActions } from './security.actions';

export interface User {
  id: string;
  email: string;
  name: string;
  anonymous: boolean;
  bearer: string;
}

export const ANONYMOUS_USER: User = {
  id: '',
  email: 'nomail',
  name: 'no user',
  anonymous: true,
  bearer: '',
};

export interface SecurityState {
  loaded: boolean;
  user: User | undefined;
}

const initialState: SecurityState = {
  loaded: false,
  user: undefined,
};

export const securityFeature = createFeature({
  name: 'security',
  reducer: createReducer<SecurityState>(
    initialState,
    on(
      securityActions.loaded,
      (state, { user }): SecurityState => ({
        ...state,
        user,
        loaded: true,
      }),
    ),
  ),
});
