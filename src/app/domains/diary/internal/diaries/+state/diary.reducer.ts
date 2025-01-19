import { createReducer, on } from '@ngrx/store';
import { diaryActions } from './diary.actions';

export const diaryFeatureKey = 'diary';

export interface Diary {
  id: number;
  title: string;
  description: string;
}

export interface DiaryEntry {
  id: number;
  diaryId: number;
  date: Date;
  content: string;
}

export type DiaryWithEntries = Diary & { entries: DiaryEntry[] };

export interface DiaryResponse {
  diaries: DiaryWithEntries[];
}

export interface DiaryState {
  diaries: Diary[];
  diaryEntries: DiaryEntry[];
  loaded: boolean;
}

const initialState: DiaryState = {
  diaries: [],
  diaryEntries: [],
  loaded: false,
};

export const diaryReducer = createReducer<DiaryState>(
  initialState,
  on(
    diaryActions.loadSuccess,
    (state, { diaryResponse }): DiaryState => ({
      ...state,
      loaded: true,
      diaries: diaryResponse.diaries.map((diary) => {
        const { id, title, description } = diary;
        return { id, title, description };
      }),
      diaryEntries: diaryResponse.diaries.map((diary) => diary.entries).flat(),
    }),
  ),
  on(diaryActions.addSuccess, (state, action): DiaryState => {
    const { id, title, description } = action.diaryWithEntries;
    return {
      ...state,
      diaries: [...state.diaries, { id, title, description }],
    };
  }),
);
