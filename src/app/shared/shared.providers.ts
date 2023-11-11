import { provideState } from '@ngrx/store';
import { sharedFeature } from './+state/sharedState';

export const sharedProviders = [provideState(sharedFeature)];
