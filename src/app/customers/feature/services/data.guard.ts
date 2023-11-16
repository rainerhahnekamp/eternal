import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CustomersRepository } from '@app/customers/data';

export const dataGuard: CanActivateFn = () => {
  const repo = inject(CustomersRepository);
  repo.load(1);
  return true;
};
