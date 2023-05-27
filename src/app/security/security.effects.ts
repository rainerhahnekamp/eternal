import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map, tap } from 'rxjs/operators';
import { securityActions } from './security.actions';
import { ANONYMOUS_USER } from './security.reducer';
import { AuthService } from '@auth0/auth0-angular';

@Injectable()
export class SecurityEffects {
  #actions$ = inject(Actions);
  #authService = inject(AuthService);

  user$ = createEffect(() =>
    this.#authService.user$.pipe(
      delay(1000),
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
      this.#actions$.pipe(
        ofType(securityActions.signIn),
        tap(() => this.#authService.loginWithRedirect())
      ),
    { dispatch: false }
  );

  signOutUser$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(securityActions.signOut),
        tap(() => this.#authService.logout())
      ),
    { dispatch: false }
  );
}
