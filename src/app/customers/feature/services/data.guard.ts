import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CustomersStore } from '@app/customers/data';

export const dataGuard: CanActivateFn = () => {
  const customersFacade = inject(CustomersStore);
  customersFacade.load(1);
  return true;
};
