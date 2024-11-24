import { Component, inject, Signal } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { CustomersComponent, CustomersViewModel } from '@app/customers/ui';
import { customersActions, fromCustomers } from '@app/customers/data';

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
  #store = inject(Store);
  viewModel: Signal<CustomersViewModel> = this.#store.selectSignal(
    createSelector(fromCustomers.selectPagedCustomers, (pagedCustomers) => ({
      customers: pagedCustomers.customers,
      pageIndex: pagedCustomers.page,
      length: pagedCustomers.total,
    })),
  );

  setSelected(id: number) {
    this.#store.dispatch(customersActions.select({ id }));
  }

  setUnselected() {
    this.#store.dispatch(customersActions.unselect());
  }

  switchPage(page: number) {
    console.log('switch to page ' + page + ' is not implemented');
  }
}
