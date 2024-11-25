import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { customersActions } from './customers.actions';
import { MessageService } from '@app/shared/ui-messaging';
import { Customer } from '@app/customers/model';

@Injectable()
export class CustomersEffects {
  #actions$ = inject(Actions);
  #http = inject(HttpClient);
  #router = inject(Router);
  #baseUrl = '/customer';
  #uiMessage = inject(MessageService);

  load$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.load),
      switchMap(({ page }) =>
        this.#http
          .get<{ content: Customer[]; total: number }>(this.#baseUrl, {
            params: new HttpParams().set('page', page),
          })
          .pipe(
            map(({ content, total }) =>
              customersActions.loaded({ customers: content, total, page }),
            ),
          ),
      ),
    );
  });

  add$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.add),
      concatMap(({ customer }) =>
        this.#http.post<{ customers: Customer[]; id: number }>(
          this.#baseUrl,
          customer,
        ),
      ),

      tap(() => this.#router.navigateByUrl('/customers')),
      map(() => customersActions.load({ page: 0 })),
    );
  });

  update$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.update),
      concatMap(({ customer }) =>
        this.#http
          .put<Customer[]>(this.#baseUrl, customer)
          .pipe(tap(() => this.#uiMessage.info('Customer has been updated'))),
      ),
      map(() => customersActions.load({ page: 0 })),
    );
  });

  remove$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.remove),
      concatMap(({ customer }) =>
        this.#http.delete<Customer[]>(`${this.#baseUrl}/${customer.id}`),
      ),
      tap(() => this.#router.navigateByUrl('/customers')),
      map(() => customersActions.load({ page: 0 })),
    );
  });
}
