import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CustomerStore } from '../../data/customer-store';
import { injectCustomerEvents } from '../../data/customer-events';

export const dataGuard: CanActivateFn = () => {
  const events = injectCustomerEvents();
  const customerStore = inject(CustomerStore);
  if (customerStore.status() === 'init') {
    events.load({ page: 0 });
  }
  return true;
};
