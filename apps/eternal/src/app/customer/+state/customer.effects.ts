import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { Customer } from '../customer';
import { CustomerActions } from './customer.actions';
import { fromCustomer } from './customer.selectors';

@Injectable()
export class CustomerEffects {
  private pageSize = '10';
  private url = '/customer';
  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.add),
      concatMap(({ customer }) => this.http.post<Customer>(this.url, customer)),
      map((customer) => CustomerActions.added({ customer })),
      tap(() => this.router.navigateByUrl('/customer'))
    )
  );
  update = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.update),
      concatMap(({ customer }) => this.http.put<Customer>(this.url, customer)),
      map((customer) => CustomerActions.updated({ customer })),
      tap(() => this.router.navigateByUrl('/customer'))
    )
  );
  remove = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.remove),
      concatMap(({ customer }) =>
        this.http.delete<void>(`${this.url}/${customer.id}`).pipe(map(() => customer))
      ),
      map((customer) => CustomerActions.removed({ customer })),
      tap(() => this.router.navigateByUrl('/customer'))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private http: HttpClient,
    private router: Router
  ) {}

  private fetchCustomers = <T>(
    observable: Observable<T>
  ): Observable<{ customers: Customer[]; pageCount: number }> =>
    observable.pipe(
      concatLatestFrom(() => this.store.select(fromCustomer.selectCurrentPage)),
      switchMap(([, page]) =>
        this.http.get<{ content: Customer[]; totalPages: number }>(this.url, {
          params: new HttpParams().append('page', '' + page).append('pageSize', this.pageSize)
        })
      ),
      map(({ content, totalPages }) => ({
        customers: content,
        pageCount: totalPages
      }))
    );

  nextPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.nextPage),
      this.fetchCustomers,
      map(({ customers }) => CustomerActions.nextPageSuccess({ customers }))
    )
  );
  previousPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.previousPage),
      this.fetchCustomers,
      map(({ customers }) => CustomerActions.previousPageSuccess({ customers }))
    )
  );
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.load),
      this.fetchCustomers,
      map(({ customers, pageCount }) =>
        CustomerActions.loaded({
          customers,
          pageCount
        })
      )
    )
  );
}
