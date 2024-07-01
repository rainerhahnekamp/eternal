import { createFeature, createReducer, on } from '@ngrx/store';
import { sharedActions } from './shared.actions';

export interface SharedReducer {
  activeHttpRequest: boolean;
}

const initialState: SharedReducer = {
  activeHttpRequest: false
};

export const sharedFeature = createFeature({
  name: 'shared',
  reducer: createReducer<SharedReducer>(
    initialState,
    on(sharedActions.httpRequestStarted, (state) => ({
      ...state,
      activeHttpRequest: true
    })),
    on(sharedActions.httpRequestEnded, (state) => ({
      ...state,
      activeHttpRequest: false
    }))
  )
});
