import { createFeatureSelector } from '@ngrx/store';
import { diaryFeatureKey, DiaryState } from './diary.reducer';

export const featureSelector = createFeatureSelector<DiaryState>(diaryFeatureKey);
