import { createFeature, createReducer, on } from '@ngrx/store';
import { securityActions } from './security.actions';

export interface User {
  id: string;
  email: string;
  name: string;
  anonymous: boolean;
}

export const ANONYMOUS_USER: User = {
  id: '',
  email: 'nomail',
  name: 'no user',
  anonymous: true
};

export interface SecurityReducer {
  loaded: boolean;
  user: User | undefined;
}

const initialState: SecurityReducer = {
  loaded: false,
  user: undefined
};

export const securityFeature = createFeature({
  name: 'security',
  reducer: createReducer<SecurityReducer>(
    initialState,
    on(securityActions.loaded, securityActions.signInSuccess, (state, { user }) => ({
      ...state,
      user,
      loaded: true
    })),
    on(securityActions.signInSuccess, (state, { user }) => ({
      ...state,
      user
    }))
  )
});
