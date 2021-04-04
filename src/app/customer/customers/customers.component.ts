import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomerActions } from '../+state/customer.actions';
import { fromCustomer } from '../+state/customer.selectors';
import { Customer } from '../customer';

@Component({
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  data$: Observable<{ customers: Customer[]; currentPage: number; pageCount: number }>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(CustomerActions.load());
    this.data$ = this.store.select(fromCustomer.selectCustomersAndPage);
  }

  previousPage() {
    this.store.dispatch(CustomerActions.previousPage());
  }

  nextPage() {
    this.store.dispatch(CustomerActions.nextPage());
  }
}
