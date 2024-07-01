import { createAction, props } from '@ngrx/store';
import { DiaryResponse, DiaryWithEntries } from './diary.reducer';

const load = createAction('[Diary] Load');
const loadSuccess = createAction('[Diary] Load Success', props<{ diaryResponse: DiaryResponse }>());

const add = createAction('[Diary] Add', props<{ title: string; description: string }>());
const addSuccess = createAction(
  '[Diary] Add Success',
  props<{ diaryWithEntries: DiaryWithEntries }>()
);

const addEntry = createAction('[Diary] Add Entry', props<{ diaryId: number; content: string }>());
const addEntrySuccess = createAction('[Diary] Add Entry Success');

export const diaryActions = {
  load,
  loadSuccess,
  add,
  addSuccess,
  addEntry,
  addEntrySuccess
};
