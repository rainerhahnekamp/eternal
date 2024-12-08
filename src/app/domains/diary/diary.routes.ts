import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  diaryFeatureKey,
  diaryReducer,
} from './internal/diaries/+state/diary.reducer';
import { DiaryEffects } from './internal/diaries/+state/diary.effects';
import { DiariesComponent } from './internal/diaries/diaries.component';

export default [
  {
    path: '',
    providers: [
      importProvidersFrom(
        StoreModule.forFeature(diaryFeatureKey, diaryReducer),
        EffectsModule.forFeature([DiaryEffects]),
      ),
    ],
    component: DiariesComponent,
  },
] satisfies Routes;
