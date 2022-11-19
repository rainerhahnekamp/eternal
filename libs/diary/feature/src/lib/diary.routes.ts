import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { DiaryEffects } from './+state/diary.effects';
import { diaryFeature } from './+state/diary.reducer';
import { DiariesComponent } from './diaries/diaries.component';

export const diaryRoutes: Routes = [
  {
    path: '',
    providers: [provideState(diaryFeature), provideEffects([DiaryEffects])],
    component: DiariesComponent,
  },
];
