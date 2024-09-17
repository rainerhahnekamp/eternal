import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { customersActions } from './customers.actions';
import { MessageService } from '@app/shared/ui-messaging';
import { Customer } from '@app/customers/model';
import { Configuration } from '@app/shared/config';

@Injectable()
export class CustomersEffects {
  #actions$ = inject(Actions);
  #http = inject(HttpClient);
  #router = inject(Router);
  #uiMessage = inject(MessageService);
  #config = inject(Configuration);
  #baseUrl = '/customer';

  load$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.load),
      switchMap(({ page, callback }) =>
        this.#http
          .get<{ content: Customer[]; total: number }>(this.#baseUrl, {
            params: new HttpParams().set(
              'page',
              this.#config.pagedCustomers ? page : 0,
            ),
          })
          .pipe(
            map(({ content, total }) =>
              customersActions.loaded({ customers: content, total, page }),
            ),
            tap(() => (callback ? callback() : {})),
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

      tap(() => this.#router.navigateByUrl('/customer')),
      map(() => customersActions.load({ page: 1 })),
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
      tap(() => this.#router.navigateByUrl('/customer')),
      map(() => customersActions.load({ page: 1 })),
    );
  });

  remove$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.remove),
      concatMap(({ id }) =>
        this.#http.delete<Customer[]>(`${this.#baseUrl}/${id}`),
      ),
      map(() =>
        customersActions.load({
          page: 1,
          callback: () => this.#router.navigateByUrl('/customer'),
        }),
      ),
    );
  });
}
