import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { BookingsOverview } from './overview/bookings-overview';
import { BookingsStore } from './+state/bookings-store.service';
import { CustomersClient } from '../../customers/api/customers-client';

@Component({
  selector: 'app-overview-container',
  template: ` @if (viewModel(); as value) {
    <app-overview [viewModel]="value"></app-overview>
  }`,
  imports: [BookingsOverview],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsOverviewPage {
  #repo = inject(BookingsStore);

  #customersApi = inject(CustomersClient);

  protected readonly viewModel = computed(() => {
    const bookings = this.#repo.bookings();
    const loaded = this.#repo.loaded();
    const customer = this.#customersApi.selectedCustomer();

    if (!loaded || !customer) {
      return false;
    }

    return {
      customerName: `${customer.name}, ${customer.firstname}`,
      bookings,
    };
  });

  constructor() {
    this.#repo.load();
  }
}
