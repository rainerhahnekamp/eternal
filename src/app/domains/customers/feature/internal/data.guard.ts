import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CustomerStore } from '../../data/customer-store';

export const dataGuard: CanActivateFn = () => {
  const customerStore = inject(CustomerStore);
  if (customerStore.status() === 'init') {
    customerStore.load(0);
  }
  return true;
};
