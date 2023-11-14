import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from './security.reducer';
import { fromSecurity } from './security.selectors';
import { securityActions } from './security.actions';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  private store = inject(Store);

  readonly loaded$ = this.store.select(fromSecurity.selectLoaded);

  readonly loadedUser$ = this.store
    .select(fromSecurity.selectLoadedUser)
    .pipe(this.#verifyUser);

  readonly signedIn$ = this.store.select(fromSecurity.selectSignedIn);

  signIn() {
    this.store.dispatch(securityActions.signIn());
  }

  signOut() {
    this.store.dispatch(securityActions.signOut());
  }

  #verifyUser(user$: Observable<undefined | User>) {
    function userGuard(user: undefined | User): user is User {
      return user !== null;
    }

    return user$.pipe(filter(userGuard));
  }
}
