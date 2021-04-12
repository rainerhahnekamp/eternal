import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { sharedActions } from './+state/shared.actions';
import { User } from './+state/shared.reducer';
import { fromShared } from './+state/shared.selectors';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private store: Store) {}

  get loaded$(): Observable<boolean> {
    return this.store.select(fromShared.selectLoaded);
  }

  get loadedUser$(): Observable<User> {
    return combineLatest([
      this.store.select(fromShared.selectLoaded),
      this.store.select(fromShared.selectUser)
    ]).pipe(
      filter(([loaded]) => loaded),
      map(([, user]) => user)
    );
  }

  get signedIn$(): Observable<boolean> {
    return this.store.select(fromShared.selectSignedIn);
  }

  load() {
    this.store.dispatch(sharedActions.loadUser());
  }

  signIn(email: string, password: string) {
    this.store.dispatch(sharedActions.signInUser({ email, password }));
  }

  signOut() {
    this.store.dispatch(sharedActions.signOutUser());
  }
}
