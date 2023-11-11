import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { Customer } from '../customer';
import { fromCustomer } from './customer.selectors';
import { customerActions } from './customer.actions';

@Injectable()
export class CustomerEffects {
  private pageSize = 10;
  private url = '/customers';

  #actions$ = inject(Actions);
  #store = inject(Store);
  #http = inject(HttpClient);
  #router = inject(Router);

  add$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customerActions.add),
      concatMap(({ customer }) =>
        this.#http.post<Customer>(this.url, customer),
      ),
      map((customer) => customerActions.added({ customer })),
      tap(() => this.#router.navigateByUrl('/customer')),
    );
  });

  update$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customerActions.update),
      concatMap(({ customer }) => this.#http.put<Customer>(this.url, customer)),
      map((customer) => customerActions.updated({ customer })),
      tap(() => this.#router.navigateByUrl('/customer')),
    );
  });

  remove$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customerActions.remove),
      concatMap(({ id }) => this.#http.delete<void>(`${this.url}/${id}`)),
      map(() => customerActions.removed()),
      tap(() => this.#router.navigateByUrl('/customer')),
    );
  });

  #fetchCustomers = <T>(
    observable: Observable<T>,
  ): Observable<{ customers: Customer[]; pageCount: number }> =>
    observable.pipe(
      concatLatestFrom(() =>
        this.#store.select(fromCustomer.selectCurrentPage),
      ),
      switchMap(([, page]) =>
        this.#http.get<{ content: Customer[]; total: number }>(this.url, {
          params: new HttpParams()
            .append('page', '' + page)
            .append('pageSize', this.pageSize),
        }),
      ),
      map(({ content, total }) => ({
        customers: content,
        pageCount: Math.floor(total / this.pageSize),
      })),
      tap(console.log),
    );

  nextPage$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customerActions.nextPage),
      this.#fetchCustomers,
      map(({ customers }) => customerActions.nextPageSuccess({ customers })),
    );
  });

  previousPage$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customerActions.previousPage),
      this.#fetchCustomers,
      map(({ customers }) =>
        customerActions.previousPageSuccess({ customers }),
      ),
    );
  });

  load$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customerActions.load),
      this.#fetchCustomers,
      map(({ customers, pageCount }) =>
        customerActions.loaded({
          customers,
          pageCount,
        }),
      ),
    );
  });
}
