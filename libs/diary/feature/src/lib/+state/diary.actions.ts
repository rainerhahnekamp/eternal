import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DiaryResponse, DiaryWithEntries } from './diary.reducer';

export const diaryActions = createActionGroup({
  source: 'Diary',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ diaryResponse: DiaryResponse }>(),
    Add: props<{ title: string; description: string }>(),
    'Add Success': props<{ diaryWithEntries: DiaryWithEntries }>(),
    'Add Entry': props<{ diaryId: number; content: string }>(),
    'Add Entry Success': emptyProps(),
  },
});
