import { Component, inject, Signal } from '@angular/core';
import {
  CustomersView,
  CustomersViewModel,
} from '../../ui/customers/customers-view';
import { CustomerStore } from '../../data/customer-store';
import { injectCustomerEvents } from '../../data/customer-events';

@Component({
  selector: 'app-customers-container',
  template: ` <app-customers
    [viewModel]="pagedCustomer()"
    (setSelected)="setSelected($event)"
    (setUnselected)="setUnselected()"
    (switchPage)="switchPage($event)"
  ></app-customers>`,
  imports: [CustomersView],
})
export class CustomersPage {
  readonly #customerStore = inject(CustomerStore);
  readonly #events = injectCustomerEvents();

  pagedCustomer: Signal<CustomersViewModel> = this.#customerStore.pagedCustomer;

  setSelected(id: number) {
    this.#events.select(id);
  }

  setUnselected() {
    this.#events.unselect();
  }

  switchPage(page: number) {
    this.#events.load({ page });
  }
}
