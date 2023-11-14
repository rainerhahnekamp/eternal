import { Component, inject } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { customersActions } from '../+state/customers.actions';
import { fromCustomers } from '../+state/customers.selectors';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { CustomersComponent, CustomersViewModel } from '@app/customers/ui';

@Component({
  template: ` @if (viewModel$ | async; as viewModel) {
    <app-customers
      [viewModel]="viewModel"
      (setSelected)="setSelected($event)"
      (setUnselected)="setUnselected()"
      (switchPage)="switchPage($event)"
    ></app-customers>
    }`,
  standalone: true,
  imports: [CustomersComponent, NgIf, AsyncPipe, AsyncPipe],
})
export class CustomersContainerComponent {
  #store = inject(Store);
  viewModel$: Observable<CustomersViewModel> = this.#store.select(
    createSelector(fromCustomers.selectPagedCustomers, (pagedCustomers) => ({
      customers: pagedCustomers.customers,
      pageIndex: pagedCustomers.page - 1,
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
