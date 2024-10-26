import { inject, Injectable, NgZone } from '@angular/core';
import Keycloak from 'keycloak-js';

export interface UserProfile {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  #keycloak: Keycloak | undefined;
  #profile: UserProfile | undefined;
  readonly #zone = inject(NgZone);

  get keycloak() {
    if (!this.#keycloak) {
      console.log('initialize keycloak');
      this.#keycloak = new Keycloak({
        url: 'https://auth.eternal-holidays.net:8443/',
        realm: 'eternal',
        clientId: 'frontend',
      });
    }
    return this.#keycloak;
  }

  get profile() {
    return this.#profile;
  }

  async init() {
    const authenticated = await this.#zone.runOutsideAngular(() =>
      this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      }),
    );

    if (!authenticated) {
      return authenticated;
    }
    this.#profile =
      (await this.keycloak.loadUserInfo()) as unknown as UserProfile;
    this.#profile.token = this.keycloak.token || '';

    return true;
  }

  login() {
    return this.keycloak.login();
  }

  logout() {
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }
}
