import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { concatMap, filter, map, tap } from 'rxjs/operators';
import { customersActions } from './customers.actions';
import { MessageService } from '@app/shared/ui-messaging';
import { Customer } from '@app/customers/model';
import { Store } from '@ngrx/store';
import { customersFeature } from '@app/customers/data/customers.reducer';
import { safeSwitchMap } from '@app/shared/ngrx-utils';

@Injectable()
export class CustomersEffects {
  #actions$ = inject(Actions);
  #http = inject(HttpClient);
  #router = inject(Router);
  #uiMessage = inject(MessageService);
  #store = inject(Store);
  #baseUrl = '/customers';

  init$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.init),
      concatLatestFrom(() =>
        this.#store.select(customersFeature.selectIsLoaded),
      ),
      filter(([, isLoaded]) => isLoaded === false),
      map(() => customersActions.get({ page: 1 })),
    );
  });

  get$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.get),
      concatLatestFrom(() => this.#store.select(customersFeature.selectPage)),
      filter(([action, page]) => action.page !== page),
      map(([{ page }]) => customersActions.load({ page })),
    );
  });

  load$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.load),
      safeSwitchMap(
        ({ page }) =>
          this.#http
            .get<{ content: Customer[]; total: number }>(this.#baseUrl, {
              params: new HttpParams().set('page', page),
            })
            .pipe(
              map(({ content, total }) =>
                customersActions.loadSuccess({
                  customers: content,
                  total,
                  page,
                }),
              ),
            ),
        () => customersActions.loadFailure(),
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
      map(() => customersActions.load({ page: 1 })),
    );
  });

  remove$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(customersActions.remove),
      concatMap(({ customer }) =>
        this.#http.delete<Customer[]>(`${this.#baseUrl}/${customer.id}`),
      ),
      tap(() => this.#router.navigateByUrl('/customers')),
      map(() => customersActions.load({ page: 1 })),
    );
  });
}
