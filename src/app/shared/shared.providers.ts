import { provideState, provideStore } from '@ngrx/store';
import { sharedFeature } from './+state/shared.reducer';
import { provideEffects } from '@ngrx/effects';

export const sharedProviders = [provideState(sharedFeature)];
