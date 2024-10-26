import { Component, inject } from '@angular/core';
import { CustomersComponent } from '../../../ui/customers/customers.component';
import { CustomersStore } from '../../../data/provide-customer';

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
  #customersStore = inject(CustomersStore);
  protected viewModel = this.#customersStore.pagedCustomers;

  setSelected(id: number) {
    this.#customersStore.select(id);
  }

  setUnselected() {
    this.#customersStore.unselect();
  }

  switchPage(page: number) {
    console.log('switch to page ' + page + ' is not implemented');
  }
}
