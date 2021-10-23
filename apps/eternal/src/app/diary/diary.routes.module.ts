import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DiaryEffects } from './diaries/+state/diary.effects';
import { diaryFeatureKey, diaryReducer } from './diaries/+state/diary.reducer';
import { DiariesComponent, DiariesComponentModule } from './diaries/diaries.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DiariesComponent
      }
    ]),
    DiariesComponentModule,
    StoreModule.forFeature(diaryFeatureKey, diaryReducer),
    EffectsModule.forFeature([DiaryEffects])
  ]
})
export class DiaryRoutesModule {}
