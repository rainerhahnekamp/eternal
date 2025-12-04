import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  removeAllEntities,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { Customer } from '../model/customer';
import { computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, switchMap, tap } from 'rxjs/operators';
import { Configuration } from '../../../shared/config/configuration';
import { mapResponse, tapResponse } from '@ngrx/operators';
import { EMPTY, pipe } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from '../../../shared/ui-messaging/message/message.service';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import {
  Events,
  on,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';
import { customerEvents } from './customer-events';

export const CustomerStore = signalStore(
  { providedIn: 'root' },
  // withDevtools('customer'),
  withEntities<Customer>(),
  withState({
    page: 0,
    total: 0,
    selectedId: undefined as number | undefined,
    status: 'init' as 'init' | 'loading' | 'loaded',
  }),
  withMethods((store) => {
    const httpClient = inject(HttpClient);
    const config = inject(Configuration);
    const router = inject(Router);
    const uiMessage = inject(MessageService);
    const baseUrl = '/customer';

    return {
      add: rxMethod<Customer>(
        concatMap((customer) =>
          httpClient
            .post<{ customers: Customer[]; id: number }>(baseUrl, customer)
            .pipe(
              tapResponse({
                next: () => {
                  uiMessage.info('Customer has been updated');
                  // _load({ page: 0 });
                  router.navigateByUrl('/customer');
                },
                error: () => EMPTY,
              }),
            ),
        ),
      ),
      update: rxMethod<Customer>(
        concatMap((customer) =>
          httpClient.put<Customer[]>(baseUrl, customer).pipe(
            tapResponse({
              next: () => {
                // _load({ page: 0 });
                router.navigateByUrl('/customer');
              },
              error: () => EMPTY,
            }),
          ),
        ),
      ),
      remove: rxMethod<number>(
        concatMap((id) =>
          httpClient.delete<Customer[]>(`${baseUrl}/${id}`).pipe(
            tapResponse({
              next: () => {
                // _load({ page: 0 });
                router.navigateByUrl('/customer');
              },
              error: () => EMPTY,
            }),
          ),
        ),
      ),
      select: rxMethod<number>(
        tap((selectedId) => patchState(store, { selectedId })),
      ),
      unselect() {
        patchState(store, { selectedId: undefined });
      },
    };
  }),
  withComputed((state) => ({
    selectedCustomer: computed(() =>
      state.entities().find((customer) => customer.id === state.selectedId()),
    ),
    pagedCustomer: computed(() => ({
      customers: state.entities().map((customer) => ({
        ...customer,
        selected: customer.id === state.selectedId(),
      })),
      pageIndex: state.page(),
      length: state.total(),
    })),
  })),
  withEventHandlers(
    (
      _,
      events = inject(Events),
      httpClient = inject(HttpClient),
      baseUrl = '/customer',
    ) => [
      events.on(customerEvents.load).pipe(
        switchMap(({ payload: page }) =>
          httpClient
            .get<{ content: Customer[]; total: number }>(baseUrl, {
              params: new HttpParams().set('page', page),
            })
            .pipe(
              mapResponse({
                next: (payload) => customerEvents.loaded(payload),
                error: () => EMPTY,
              }),
            ),
        ),
      ),
    ],
  ),
  withReducer(
    on(customerEvents.load, () => ({ status: 'loading' as const })),
    on(customerEvents.loaded, ({ payload }) => [
      {
        status: 'loaded' as const,
        total: payload.total,
      },
      setAllEntities(payload.content),
    ]),
  ),
);
