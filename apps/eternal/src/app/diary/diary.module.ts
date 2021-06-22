import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DiaryEffects } from './diaries/+state/diary.effects';
import { diaryFeatureKey, diaryReducer } from './diaries/+state/diary.reducer';
import { DiariesComponent } from './diaries/diaries.component';

@NgModule({
  declarations: [DiariesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DiariesComponent
      }
    ]),
    StoreModule.forFeature(diaryFeatureKey, diaryReducer),
    EffectsModule.forFeature([DiaryEffects])
  ]
})
export class DiaryModule {}
