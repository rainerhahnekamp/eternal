import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
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

export const CustomerStore = signalStore(
  { providedIn: 'root' },
  withDevtools('customer'),
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

    const _load = rxMethod<{ page: number; callback?: () => void }>(
      pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap(({ page, callback }) =>
          httpClient
            .get<{ content: Customer[]; total: number }>(baseUrl, {
              params: new HttpParams().set(
                'page',
                config.pagedCustomers ? page : 0,
              ),
            })
            .pipe(
              mapResponse({
                next: ({ content, total }) =>
                  patchState(store, setAllEntities(content), { total, page }),
                error: () => EMPTY,
              }),
              tap(() => (callback ? callback() : {})),
              tap(() => patchState(store, { status: 'loaded' })),
            ),
        ),
      ),
    );

    return {
      load(page: number, callback?: () => void) {
        _load({ page, callback });
      },
      add: rxMethod<Customer>(
        concatMap((customer) =>
          httpClient
            .post<{ customers: Customer[]; id: number }>(baseUrl, customer)
            .pipe(
              tapResponse({
                next: () => {
                  uiMessage.info('Customer has been updated');
                  router.navigateByUrl('/customer');
                  _load({ page: 1 });
                },
                error: () => EMPTY,
              }),
            ),
        ),
      ),
      update: rxMethod<Customer>(
        concatMap((customer) =>
          httpClient.put<Customer[]>(baseUrl, customer).pipe(
            tap(() => {
              router.navigateByUrl('/customer');
              _load({ page: 1 });
            }),
          ),
        ),
      ),
      remove: rxMethod<number>(
        concatMap((id) =>
          httpClient.delete<Customer[]>(`${baseUrl}/${id}`).pipe(
            tapResponse({
              next: () => {
                router.navigateByUrl('/customer');
                _load({ page: 1 });
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
      pageIndex: state.page() - 1,
      length: state.total(),
    })),
  })),
);
