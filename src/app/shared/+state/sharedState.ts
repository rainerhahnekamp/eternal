import { createFeature, createReducer, on } from '@ngrx/store';
import { sharedActions } from './shared.actions';

export interface SharedState {
  activeHttpRequest: boolean;
}

const initialState: SharedState = {
  activeHttpRequest: false,
};

export const sharedFeature = createFeature({
  name: 'shared',
  reducer: createReducer(
    initialState,
    on(
      sharedActions.httpRequestStarted,
      (state): SharedState => ({
        ...state,
        activeHttpRequest: true,
      }),
    ),
    on(
      sharedActions.httpRequestEnded,
      (state): SharedState => ({
        ...state,
        activeHttpRequest: false,
      }),
    ),
  ),
});
