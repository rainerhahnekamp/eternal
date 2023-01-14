import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Customer } from './customer';
import { customers as originalCustomers } from './data';
import { Configuration } from '../shared/configuration';

@Injectable()
export class CustomersInterceptor implements HttpInterceptor {
  #customers: Customer[] = originalCustomers.sort(sortCustomers);
  #pageSize = 10;

  #configuration = inject(Configuration);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.#configuration.mockCustomers) {
      return next.handle(req);
    }

    if (req.url.startsWith(`${this.#configuration.baseUrl}/customer`)) {
      switch (req.method) {
        case 'GET':
          return this.#toHttpResponse(this.#get(req.url, { params: req.params }));
        case 'POST':
          return this.#post(req.url, req.body as Customer);
        case 'DELETE':
          return this.#toHttpResponse(this.#delete(req.url));
        case 'PUT':
          return this.#put(req.url, req.body as Customer);
      }
      return next.handle(req);
    } else {
      return next.handle(req);
    }
  }

  #toHttpResponse(data$: Observable<unknown>) {
    return data$.pipe(map((data) => new HttpResponse({ body: data })));
  }

  #get(
    url: string,
    options: { params: HttpParams }
  ): Observable<HttpResponse<{ content: Customer[]; total: number }>> {
    if (!options.params.has('page')) {
      return of({ content: this.#customers, total: this.#customers.length }).pipe(
        this.#logRequest('GET', url)
      );
    } else {
      return this.#pagedCustomers(Number(options.params.get('page'))).pipe(
        this.#logRequest('GET', url)
      );
    }
  }

  #post(url: string, customer: Customer): Observable<HttpResponse<unknown>> {
    const nextId = this.#getNextId();
    this.#customers.push({ ...customer, id: nextId });
    this.#customers.sort(sortCustomers);
    return this.#toHttpResponse(
      this.#pagedCustomers(1).pipe(
        map((customers) => ({ customers, id: nextId })),
        this.#logRequest('POST', url, customer)
      )
    );
  }

  #put(url: string, customer: Customer): Observable<HttpResponse<unknown>> {
    return this.#toHttpResponse(
      of(true).pipe(
        map(() => {
          if (customer.name === 'asdf') {
            throw new HttpErrorResponse({
              status: 400,
              error: 'no dummy names please'
            });
          } else {
            this.#customers = this.#customers.map((c) => (c.id === customer.id ? customer : c));
            return customer;
          }
        })
      )
    );
  }

  #delete(url: string) {
    const matches = url.match(/(\d+)$/);
    if (!matches) {
      throw new Error('invalid url for deletion');
    }

    const id = Number(matches[0]);
    this.#customers = this.#customers.filter((customer) => customer.id !== id);
    return this.#pagedCustomers(1).pipe(this.#logRequest('DELETE', url));
  }

  #getNextId() {
    return Math.max(...this.#customers.map((customer) => customer.id)) + 1;
  }

  #pagedCustomers(page: number): Observable<{ content: Customer[]; total: number }> {
    const start = page * this.#pageSize;
    const end = start + this.#pageSize;
    return of({
      content: this.#customers.slice(start, end),
      total: this.#customers.length
    });
  }

  #logRequest<D>(
    httpMethod: string,
    url: string,
    body?: unknown
  ): (source$: Observable<D>) => Observable<HttpResponse<D>> {
    return (observable: Observable<D>) =>
      observable.pipe(
        delay(125),
        tap((response) => {
          console.group('Mocked Http Client');
          console.log(`${httpMethod}: ${url}`);
          if (body) {
            console.log(`Body: ${JSON.stringify(body)}`);
          }
          console.log(response);
          console.groupEnd();
        }),
        map(toHttpResponse)
      );
  }
}

function toHttpResponse<D>(value: D): HttpResponse<D> {
  return value as unknown as HttpResponse<D>;
}

function sortCustomers(customer1: Customer, customer2: Customer) {
  return customer1.name.localeCompare(customer2.name);
}
