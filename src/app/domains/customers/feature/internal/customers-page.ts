import { Component, inject, Signal } from '@angular/core';
import {
  CustomersView,
  CustomersViewModel,
} from '../../ui/customers/customers-view';
import { CustomerStore } from '../../data/customer-store';
import { injectDispatch } from '@ngrx/signals/events';
import { customerEvents } from '../../data/customer-events';

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
  readonly customersDispatcher = injectDispatch(customerEvents);

  pagedCustomer: Signal<CustomersViewModel> = this.#customerStore.pagedCustomer;

  setSelected(id: number) {
    this.#customerStore.select(id);
  }

  setUnselected() {
    this.#customerStore.unselect();
  }

  switchPage(page: number) {
    this.customersDispatcher.load(page);
  }
}
