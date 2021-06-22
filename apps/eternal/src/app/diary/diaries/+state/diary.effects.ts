import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { diaryActions } from './diary.actions';
import { DiaryResponse, DiaryWithEntries } from './diary.reducer';

@Injectable()
export class DiaryEffects {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(diaryActions.load),
      switchMap(() => this.httpClient.get<DiaryResponse>('/diary')),
      map((diaryResponse) => diaryActions.loadSuccess({ diaryResponse }))
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(diaryActions.add),
      switchMap(({ title, description }) =>
        this.httpClient.post<DiaryWithEntries>('/diary', {
          title,
          description
        })
      ),
      map((diaryWithEntries) => diaryActions.addSuccess({ diaryWithEntries }))
    )
  );

  addEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(diaryActions.addEntry),
      switchMap(({ diaryId, content }) =>
        this.httpClient.post('/diary', {
          diaryId,
          content
        })
      ),
      map(() => diaryActions.addEntrySuccess())
    )
  );

  constructor(private actions$: Actions, private httpClient: HttpClient) {}
}
