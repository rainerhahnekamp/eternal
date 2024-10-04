import { Component, inject, input, numberAttribute } from '@angular/core';
import { CustomerComponent } from '@app/customers/ui';
import { CustomerStore } from '@app/customers/feature/components/customer-store.service';

@Component({
  selector: 'app-edit-customer',
  template: `
    @if (customer(); as value) {
      <app-customer [customer]="value" [countries]="countries()"></app-customer>
    }
  `,
  standalone: true,
  imports: [CustomerComponent],
  providers: [CustomerStore],
})
export class EditCustomerComponent {
  readonly #customerService = inject(CustomerStore);

  readonly id = input.required({transform: numberAttribute});

  protected readonly customer = this.#customerService.customer;
  protected readonly countries = this.#customerService.countries;

  constructor() {
    this.#customerService.loadCustomer(this.id);
  }
}
