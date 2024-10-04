import { Component, inject, signal } from "@angular/core";
import { CustomersComponent } from "@app/customers/ui";
import { HttpClient } from "@angular/common/http";
import { Customer } from "@app/customers/model";

@Component({
  selector: 'app-customers-container',
  template: ` <app-customers
    [customers]="customers()"
  ></app-customers>`,
  standalone: true,
  imports: [CustomersComponent],
})
export class CustomersContainerComponent {
  readonly #http = inject(HttpClient);
  protected readonly customers = signal(new Array<Customer>())

  constructor() {
    this.#http.get<{content: Customer[]}>('/customer').subscribe((data) => {
      this.customers.set(data.content);
    });
  }
}
