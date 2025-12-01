import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { mapResponse, tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature } from '@ngrx/signals';
import { removeAllEntities } from '@ngrx/signals/entities';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { EMPTY, concatMap, switchMap, tap } from 'rxjs';
import { Configuration } from '../../../shared/config/configuration';
import { MessageService } from '../../../shared/ui-messaging/message/message.service';
import { Customer } from '../model/customer';
import { customerEvents } from './customer-events';

export function withCustomerEffects() {
  return signalStoreFeature(
    withEventHandlers((store) => {
      const events = inject(Events);
      const httpClient = inject(HttpClient);
      const baseUrl = '/customer';
      const config = inject(Configuration);
      const uiMessage = inject(MessageService);
      const router = inject(Router);

      return {
        load$: events.on(customerEvents.load).pipe(
          tap(() =>
            patchState(store, { status: 'loading' }, removeAllEntities()),
          ),
          switchMap(({ payload: { page, callback } }) =>
            httpClient
              .get<{ content: Customer[]; total: number }>(baseUrl, {
                params: new HttpParams().set(
                  'page',
                  config.pagedCustomers ? page : 0,
                ),
              })
              .pipe(
                tap(() => (callback ? callback() : {})),
                mapResponse({
                  next: ({ content: customers, total }) =>
                    customerEvents.loadSuccess({
                      customers,
                      total,
                      page,
                    }),
                  error: () => EMPTY,
                }),
              ),
          ),
        ),

        add$: events.on(customerEvents.add).pipe(
          concatMap((customer) =>
            httpClient
              .post<{ customers: Customer[]; id: number }>(baseUrl, customer)
              .pipe(
                tapResponse({
                  next: () => {
                    uiMessage.info('Customer has been updated');
                    router.navigateByUrl('/customer');
                    return customerEvents.load({ page: 0 });
                  },
                  error: () => EMPTY,
                }),
              ),
          ),
        ),
        update$: events.on(customerEvents.update).pipe(
          concatMap((customer) =>
            httpClient.put<Customer[]>(baseUrl, customer).pipe(
              tapResponse({
                next: () => {
                  router.navigateByUrl('/customer');
                  return customerEvents.load({ page: 0 });
                },
                error: () => EMPTY,
              }),
            ),
          ),
        ),
        remove$: events.on(customerEvents.remove).pipe(
          concatMap((id) =>
            httpClient.delete<Customer[]>(`${baseUrl}/${id}`).pipe(
              tapResponse({
                next: () => {
                  router.navigateByUrl('/customer');
                  return customerEvents.load({ page: 0 });
                },
                error: () => EMPTY,
              }),
            ),
          ),
        ),
      };
    }),
  );
}
