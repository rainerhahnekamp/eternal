import { inject, Injectable } from '@angular/core';
import { CustomersRepository } from '@eternal/customers/data';
import { Observable } from 'rxjs';
import { Customer } from '@eternal/customers/model';

@Injectable({
  providedIn: 'root',
})
export class CustomersApi {
  readonly selectedCustomer$: Observable<Customer> =
    inject(CustomersRepository).selectedCustomer$;
}
