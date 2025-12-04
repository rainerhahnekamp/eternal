import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CustomerStore } from '../../data/customer-store';
import { Dispatcher, injectDispatch } from '@ngrx/signals/events';
import { customerEvents } from '../../data/customer-events';
import { filter, of } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

export const dataGuard: CanActivateFn = () => {
  const customerStore = inject(CustomerStore);
  const customers = injectDispatch(customerEvents);

  const status$ = toObservable(customerStore.status);
  customers.load(0);

  return status$.pipe(
    filter((status) => status === 'loaded'),
    map(() => true),
  );
};
