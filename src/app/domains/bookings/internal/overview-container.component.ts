import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { OverviewComponent } from './overview/overview.component';
import { BookingsStore } from './+state/bookings-store.service';
import { Customers } from '../../customers/api/customers.service';

@Component({
  selector: 'app-overview-container',
  template: ` @if (viewModel(); as value) {
    <app-overview [viewModel]="value"></app-overview>
  }`,
  imports: [OverviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewContainerComponent {
  #repo = inject(BookingsStore);

  #customersApi = inject(Customers);

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
