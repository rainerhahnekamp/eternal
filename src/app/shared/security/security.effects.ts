import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { securityActions } from './security.actions';
import { ANONYMOUS_USER } from './security.reducer';
import { isPlatformServer } from '@angular/common';
import { distinctUntilChanged, of } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class SecurityEffects {
  #actions$ = inject(Actions);
  #keycloakService = inject(KeycloakService);
  #isServer = isPlatformServer(inject(PLATFORM_ID));

  user$ = createEffect(() => {
    if (this.#isServer) {
      return of(securityActions.loaded({ user: ANONYMOUS_USER }));
    }
    return this.#keycloakService.keycloakEvents$.pipe(
      map(() => this.#keycloakService.isLoggedIn()),
      distinctUntilChanged(),
      map((isLoggedIn) =>
        securityActions.loaded({
          user: isLoggedIn
            ? {
                id: '1',
                email: 'hi',
                name: '',
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
        tap(console.log),
        ofType(securityActions.signIn),
        tap(() => this.#keycloakService.login()),
      );
    },
    { dispatch: false },
  );

  signOutUser$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(securityActions.signOut),
        tap(() => this.#keycloakService.logout()),
      );
    },
    { dispatch: false },
  );
}
