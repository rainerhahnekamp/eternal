import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map, tap } from 'rxjs/operators';
import { securityActions } from './security.actions';
import { ANONYMOUS_USER } from './security.reducer';
import { AuthService } from '@auth0/auth0-angular';
import { isPlatformServer } from '@angular/common';
import { of } from 'rxjs';

@Injectable()
export class SecurityEffects {
  #actions$ = inject(Actions);
  #authService = inject(AuthService);
  #isServer = isPlatformServer(inject(PLATFORM_ID));

  user$ = createEffect(() => {
    if (this.#isServer) {
      return of(securityActions.loaded({ user: ANONYMOUS_USER }));
    }

    return this.#authService.user$.pipe(
      delay(1000),
      map((user) =>
        securityActions.loaded({
          user: user
            ? {
                id: user.email || '',
                email: user.email || '',
                name: user.name || '',
                anonymous: false,
              }
            : ANONYMOUS_USER,
        }),
      ),
    );
  });

  signInUser$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(securityActions.signIn),
        tap(() => this.#authService.loginWithRedirect()),
      );
    },
    { dispatch: false },
  );

  signOutUser$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(securityActions.signOut),
        tap(() => this.#authService.logout()),
      );
    },
    { dispatch: false },
  );
}
