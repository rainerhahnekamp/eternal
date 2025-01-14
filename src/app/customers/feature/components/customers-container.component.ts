import { Component, computed, inject, Signal } from '@angular/core';
import { CustomersComponent, CustomersViewModel } from '@app/customers/ui';
import { CustomersStore } from '../../data';

@Component({
  selector: 'app-customers-container',
  template: ` <app-customers
    [viewModel]="viewModel()"
    (setSelected)="setSelected($event)"
    (setUnselected)="setUnselected()"
    (switchPage)="switchPage($event)"
  ></app-customers>`,
  imports: [CustomersComponent],
})
export class CustomersContainerComponent {
  #store = inject(CustomersStore);
  viewModel: Signal<CustomersViewModel> = computed(() => {
    const pagedCustomers = this.#store.pagedCustomers();
    return {
      customers: pagedCustomers.customers,
      pageIndex: pagedCustomers.page,
      length: pagedCustomers.total,
    };
  });

  setSelected(id: number) {
    this.#store.select(id);
  }

  setUnselected() {
    this.#store.unselect();
  }

  switchPage(page: number) {
    this.#store.get(page);
  }
}
