import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { sharedActions } from './+state/shared.actions';
import { fromShared } from './+state/shared.selectors';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  constructor(private store: Store) {}

  get isLoading$() {
    return this.store.select(fromShared.selectActiveHttpRequest);
  }

  loading() {
    this.store.dispatch(sharedActions.httpRequestStarted());
  }

  loaded() {
    this.store.dispatch(sharedActions.httpRequestEnded());
  }
}
