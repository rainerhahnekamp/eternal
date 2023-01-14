import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DiaryEffects } from './diaries/+state/diary.effects';
import { diaryFeatureKey, diaryReducer } from './diaries/+state/diary.reducer';
import { DiariesComponent } from './diaries/diaries.component';

const diaryRoutes: Routes = [
  {
    path: '',
    providers: [
      importProvidersFrom(
        StoreModule.forFeature(diaryFeatureKey, diaryReducer),
        EffectsModule.forFeature([DiaryEffects])
      )
    ],
    component: DiariesComponent
  }
];

export default diaryRoutes;
