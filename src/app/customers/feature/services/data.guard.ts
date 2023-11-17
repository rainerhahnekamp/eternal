import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CustomersRepository, CustomersStore } from '@app/customers/data';

export const dataGuard: CanActivateFn = () => {
  const repo = inject(CustomersStore);
  repo.init();
  return true;
};
