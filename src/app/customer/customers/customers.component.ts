import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { customerActions } from '../+state/customer.actions';
import { fromCustomer } from '../+state/customer.selectors';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, AsyncPipe, DatePipe, NgIf, NgForOf]
})
export class CustomersComponent implements OnInit {
  #store = inject(Store);
  data$ = this.#store.select(fromCustomer.selectCustomersAndPage);

  ngOnInit() {
    this.#store.dispatch(customerActions.load());
  }

  previousPage() {
    this.#store.dispatch(customerActions.previousPage());
  }

  nextPage() {
    this.#store.dispatch(customerActions.nextPage());
  }
}
