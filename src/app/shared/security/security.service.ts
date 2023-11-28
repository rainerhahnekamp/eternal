import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from './security.reducer';
import { fromSecurity } from './security.selectors';
import { KeycloakService } from './keycloak-service';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  private store = inject(Store);
  private keycloakService = inject(KeycloakService);

  readonly loaded$ = this.store.select(fromSecurity.selectLoaded);

  readonly loadedUser$ = this.store
    .select(fromSecurity.selectLoadedUser)
    .pipe(this.#verifyUser);

  signIn() {
    this.keycloakService.login();
  }

  signOut() {
    this.keycloakService.logout();
  }

  #verifyUser(user$: Observable<undefined | User>) {
    function userGuard(user: undefined | User): user is User {
      return user !== null;
    }

    return user$.pipe(filter(userGuard));
  }
}
