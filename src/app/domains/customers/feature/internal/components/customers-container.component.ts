import { Component, inject, Signal } from '@angular/core';
import {
  CustomersComponent,
  CustomersViewModel,
} from '../../../ui/customers/customers.component';
import { CustomerStore } from '../../../data/customer-store.service';

@Component({
  selector: 'app-customers-container',
  template: ` <app-customers
    [viewModel]="pagedCustomer()"
    (setSelected)="setSelected($event)"
    (setUnselected)="setUnselected()"
    (switchPage)="switchPage($event)"
  ></app-customers>`,
  standalone: true,
  imports: [CustomersComponent],
})
export class CustomersContainerComponent {
  readonly #customerStore = inject(CustomerStore);

  pagedCustomer: Signal<CustomersViewModel> = this.#customerStore.pagedCustomer;

  setSelected(id: number) {
    this.#customerStore.select(id);
  }

  setUnselected() {
    this.#customerStore.unselect();
  }

  switchPage(page: number) {
    this.#customerStore.load(page + 1);
  }
}
