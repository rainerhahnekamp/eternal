import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Customer } from "@app/customers/model";
import { firstValueFrom } from "rxjs";

@Injectable({providedIn: 'root'})
export class CustomerService {
  httpClient = inject(HttpClient);

  byId(id: number): Promise<Customer> {
    return firstValueFrom(this.httpClient.get<Customer>(`/customer/${id}`))
  }
}
