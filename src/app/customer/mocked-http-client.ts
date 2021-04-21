import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sortBy } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Customer } from './customer';
import { customers as originalCustomers } from './data';

@Injectable()
export class MockedHttpClient {
  private customers = sortBy(originalCustomers, 'name');
  private pageSize = 10;

  get(url: string, options: { params: HttpParams }): Observable<Customer[]> {
    return this.sortCustomers(+options.params.get('page')).pipe(this.logRequest('GET', url));
  }

  post(url: string, customer: Customer): Observable<{ customers: Customer[]; id: number }> {
    const nextId = this.getNextId();
    this.customers.push({ ...customer, id: nextId });
    return this.sortCustomers(1).pipe(
      map((customers) => ({ customers, id: nextId })),
      this.logRequest('POST', url, customer)
    );
  }

  put(url: string, customer: Customer): Observable<{ customer: Customer }> {
    this.customers = this.customers.map((c) => {
      if (c.id === customer.id) {
        return customer;
      }
      return c;
    });
    return of({ customer });
  }

  delete(url: string): Observable<Customer[]> {
    const id = Number(url.match(/(\d+)$/)[0]);
    this.customers = this.customers.filter((customer) => customer.id !== id);
    return this.sortCustomers(1).pipe(this.logRequest('DELETE', url));
  }

  getNextId() {
    return Math.max(...this.customers.map((customer) => customer.id)) + 1;
  }

  private sortCustomers(page: number): Observable<{ content: Customer[]; totalPages: number }> {
    const end = (page + 1) * this.pageSize;
    const start = end - this.pageSize;
    return of({
      content: this.customers.slice(start, end),
      totalPages: Math.ceil(this.customers.length / this.pageSize)
    });
  }

  private logRequest(httpMethod: string, url: string, body?: any) {
    return (observable: Observable<any>) =>
      observable.pipe(
        delay(Math.random() * 1000),
        tap((response) => {
          console.group('Mocked Http Client');
          console.log(`${httpMethod}: ${url}`);
          if (body) {
            console.log(`Body: ${JSON.stringify(body)}`);
          }
          console.log(response);
          console.groupEnd();
        })
      );
  }
}
