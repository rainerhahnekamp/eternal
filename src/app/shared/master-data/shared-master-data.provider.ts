import { provideState } from '@ngrx/store';
import { masterFeature } from './master.reducer';

export const sharedMasterDataProvider = [provideState(masterFeature)];
