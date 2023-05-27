import { provideState } from '@ngrx/store';
import { sharedFeature } from './+state/shared.reducer';

export const sharedProviders = [provideState(sharedFeature)];
