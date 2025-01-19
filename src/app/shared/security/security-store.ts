import { computed, inject, PLATFORM_ID } from '@angular/core';
import { KeycloakService } from './internal/keycloak-service';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { isPlatformServer } from '@angular/common';
import { ANONYMOUS_USER, SecurityState } from './internal/models';

const initialState: SecurityState = {
  loaded: false,
  user: undefined,
};

export const SecurityStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(() => {
    const keycloakService = inject(KeycloakService);
    return {
      async signIn() {
        await keycloakService.login();
      },
      async signOut() {
        await keycloakService.logout();
      },
    };
  }),
  withComputed((state) => ({
    loadedUser: computed(() => (state.loaded() ? state.user() : undefined)),
    signedIn: computed(() => state.loaded() && !state.user()?.anonymous),
  })),
  withHooks((store) => {
    const keycloakService = inject(KeycloakService);
    const isServer = isPlatformServer(inject(PLATFORM_ID));

    return {
      async onInit() {
        if (isServer) {
          patchState(store, { user: ANONYMOUS_USER, loaded: true });
          return;
        }

        const isLoggedIn = await keycloakService.init();
        if (isLoggedIn && keycloakService.profile) {
          const { sub, email, given_name, family_name, token } =
            keycloakService.profile;
          const user = {
            id: sub,
            email,
            name: `${given_name} ${family_name}`,
            anonymous: false,
            bearer: token,
          };
          patchState(store, { user, loaded: true });
        } else {
          patchState(store, { user: ANONYMOUS_USER, loaded: true });
        }
      },
    };
  }),
);
