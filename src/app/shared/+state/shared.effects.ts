import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { sharedActions } from './shared.actions';
import { User } from './shared.reducer';

@Injectable()
export class SharedEffects {
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActions.loadUser),
      switchMap(() => this.httpClient.get<User>('/security/user-info')),
      map((user) => sharedActions.loadUserSuccess({ user }))
    )
  );

  signInUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActions.signInUser),
      switchMap(({ email, password }) =>
        this.httpClient.post<User>('/security/sign-in', { email, password })
      ),
      map((user) => sharedActions.signInUserSuccess({ user }))
    )
  );

  signOutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActions.signOutUser),
      switchMap(() => this.httpClient.post<User>('/security/sign-out', {})),
      map((user) => sharedActions.signOutUserSuccess({ user }))
    )
  );

  constructor(private actions$: Actions, private httpClient: HttpClient) {}
}
