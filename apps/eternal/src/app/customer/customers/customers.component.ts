import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomerActions } from '../+state/customer.actions';
import { fromCustomer } from '../+state/customer.selectors';

@Component({
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  data$ = this.store.select(fromCustomer.selectCustomersAndPage);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(CustomerActions.load());
  }

  previousPage() {
    this.store.dispatch(CustomerActions.previousPage());
  }

  nextPage() {
    this.store.dispatch(CustomerActions.nextPage());
  }
}

@NgModule({
  declarations: [CustomersComponent],
  exports: [CustomersComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule]
})
export class CustomersComponentModule {}
