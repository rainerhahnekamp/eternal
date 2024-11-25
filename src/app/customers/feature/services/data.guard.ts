import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { customersActions } from '@app/customers/data';

export const dataGuard: CanActivateFn = () => {
  const store = inject(Store);
  store.dispatch(customersActions.load({ page: 0 }));
  return true;
};
