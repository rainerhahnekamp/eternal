import { Component, computed, inject, Signal } from '@angular/core';
import { CustomersComponent, CustomersViewModel } from '@app/customers/ui';
import { CustomersRepository } from '@app/customers/data';

@Component({
  selector: 'app-customers-container',
  template: ` <app-customers
    [viewModel]="viewModel()"
    (setSelected)="setSelected($event)"
    (setUnselected)="setUnselected()"
    (switchPage)="switchPage($event)"
  ></app-customers>`,
  standalone: true,
  imports: [CustomersComponent],
})
export class CustomersContainerComponent {
  #repo = inject(CustomersRepository);
  viewModel: Signal<CustomersViewModel> = computed(() => {
    const pagedCustomers = this.#repo.pagedCustomers();
    return {
      customers: pagedCustomers.customers,
      pageIndex: pagedCustomers.page,
      length: pagedCustomers.total,
    };
  });

  setSelected(id: number) {
    this.#repo.select(id);
  }

  setUnselected() {
    this.#repo.unselect();
  }

  switchPage(page: number) {
    this.#repo.get(page);
  }
}
