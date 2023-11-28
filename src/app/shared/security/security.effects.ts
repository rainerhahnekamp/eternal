import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { concatMap, filter, map } from 'rxjs/operators';
import { securityActions } from './security.actions';
import { isPlatformServer } from '@angular/common';
import { of } from 'rxjs';
import { ANONYMOUS_USER } from '@app/shared/security/security.reducer';
import { KeycloakService } from './keycloak-service';

@Injectable()
export class SecurityEffects {
  #actions$ = inject(Actions);
  #keycloakService = inject(KeycloakService);
  #isServer = isPlatformServer(inject(PLATFORM_ID));

  init$ = createEffect(() => {
    if (this.#isServer) {
      return of(securityActions.loaded({ user: ANONYMOUS_USER }));
    }

    return of(this.#isServer).pipe(
      filter(() => !this.#isServer),
      concatMap(() => this.#keycloakService.init()),
      map((isLoggedIn) => {
        if (isLoggedIn && this.#keycloakService.profile) {
          const { sub, email, given_name, family_name, token } =
            this.#keycloakService.profile;
          return {
            id: sub,
            email,
            name: `${given_name} ${family_name}`,
            anonymous: false,
            bearer: token,
          };
        } else {
          return ANONYMOUS_USER;
        }
      }),
      map((user) => securityActions.loaded({ user })),
    );
  });
}
