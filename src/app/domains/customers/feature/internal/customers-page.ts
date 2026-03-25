import { Component, inject, Signal } from '@angular/core';
import {
  CustomersView,
  CustomersViewModel,
} from '../../ui/customers/customers-view';
import { CustomerStore } from '../../data/customer-store';

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

  pagedCustomer: Signal<CustomersViewModel> = this.#customerStore.pagedCustomer;

  setSelected(id: number) {
    this.#customerStore.select(id);
  }

  setUnselected() {
    this.#customerStore.unselect();
  }

  switchPage(page: number) {
    this.#customerStore.load(page);
  }
}
