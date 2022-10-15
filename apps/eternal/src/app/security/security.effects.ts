import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { securityActions } from './security.actions';
import { ANONYMOUS_USER } from './security.reducer';
import { AuthService } from '@auth0/auth0-angular';

@Injectable()
export class SecurityEffects {
  user$ = createEffect(() =>
    this.authService.user$.pipe(
      map((user) =>
        securityActions.loaded({
          user: user
            ? {
                id: user.email || '',
                email: user.email || '',
                name: user.name || '',
                anonymous: false
              }
            : ANONYMOUS_USER
        })
      )
    )
  );

  signInUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(securityActions.signIn),
        tap(() => this.authService.loginWithRedirect())
      ),
    { dispatch: false }
  );

  signOutUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(securityActions.signOut),
        tap(() => this.authService.logout())
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}
}
