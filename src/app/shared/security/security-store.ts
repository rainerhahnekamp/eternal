import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { KeycloakService } from './keycloak-service';
import { ANONYMOUS_USER, User } from '@app/shared/security/models';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SecurityStore {
  #keycloakService = inject(KeycloakService);

  loaded = signal(false);
  user = signal<User | undefined>(undefined);

  loadedUser = computed(() => (this.loaded() ? this.user() : undefined));
  signedIn = computed(() => this.loaded() && !this.user()?.anonymous);

  constructor() {
    this.onInit();
  }

  async onInit() {
    const isServer = isPlatformServer(inject(PLATFORM_ID));
    const keycloakService = inject(KeycloakService);
    if (isServer) {
      this.user.set(ANONYMOUS_USER);
      this.loaded.set(true);
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
      this.user.set(user);
      this.loaded.set(true);
    } else {
      this.user.set(ANONYMOUS_USER);
      this.loaded.set(true);
    }
  }

  async signIn() {
    await this.#keycloakService.login();
  }

  async signOut() {
    await this.#keycloakService.logout();
  }
}
