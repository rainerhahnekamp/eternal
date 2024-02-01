import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { customers as originalCustomers } from './customer-data';
import { Configuration } from '@app/shared/config';
// eslint-disable-next-line @softarc/sheriff/dependency-rule
import { Customer } from '@app/customers/model';

let customers: Customer[] = originalCustomers.sort(sortCustomers);
const pageSize = 10;

export const customersInterceptor: HttpInterceptorFn = (req, handle) => {
  const configuration = inject(Configuration);

  if (!req.url.startsWith('/customer')) {
    return handle(req);
  }

  if (!configuration.mockCustomers) {
    return handle(req);
  }

  switch (req.method) {
    case 'GET':
      return toHttpResponse(get(req.url, { params: req.params }));
    case 'POST':
      return post(req.url, req.body as Customer);
    case 'DELETE':
      return toHttpResponse(remove(req.url));
    case 'PUT':
      return put(req.url, req.body as Customer);
  }
  return handle(req);
};

function toHttpResponse<Data>(data$: Observable<Data>) {
  return data$.pipe(map((data) => new HttpResponse({ body: data })));
}

function get(
  url: string,
  options: { params: HttpParams },
): Observable<{ content: Customer[]; total: number }> {
  if (!options.params.has('page')) {
    return of({
      content: customers,
      total: customers.length,
    }).pipe(logRequest('GET', url));
  } else {
    return pagedCustomers(Number(options.params.get('page'))).pipe(
      logRequest('GET', url),
    );
  }
}

function post(
  url: string,
  customer: Customer,
): Observable<HttpResponse<unknown>> {
  const nextId = getNextId();
  customers.push({ ...customer, id: nextId });
  customers.sort(sortCustomers);
  return toHttpResponse(
    pagedCustomers(1).pipe(
      map((customers) => ({ customers, id: nextId })),
      logRequest('POST', url, customer),
    ),
  );
}

function put(
  url: string,
  customer: Customer,
): Observable<HttpResponse<unknown>> {
  return toHttpResponse(
    of(true).pipe(
      map(() => {
        if (customer.name === 'asdf') {
          throw new HttpErrorResponse({
            status: 400,
            error: 'no dummy names please',
          });
        } else {
          customers = customers.map((c) =>
            c.id === customer.id ? customer : c,
          );
          return customer;
        }
      }),
    ),
  );
}

function remove(url: string) {
  const matches = url.match(/(\d+)$/);
  if (!matches) {
    throw new Error('invalid url for deletion');
  }

  const id = Number(matches[0]);
  customers = customers.filter((customer) => customer.id !== id);
  return pagedCustomers(1).pipe(logRequest('DELETE', url));
}

function getNextId() {
  return Math.max(...customers.map((customer) => customer.id)) + 1;
}

function pagedCustomers(
  page: number,
): Observable<{ content: Customer[]; total: number }> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return of({
    content: customers.slice(start, end),
    total: customers.length,
  });
}

function logRequest<D>(
  httpMethod: string,
  url: string,
  body?: unknown,
): (source$: Observable<D>) => Observable<D> {
  return (source$: Observable<D>) =>
    source$.pipe(
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
    );
}

function sortCustomers(customer1: Customer, customer2: Customer) {
  return customer1.name.localeCompare(customer2.name);
}
