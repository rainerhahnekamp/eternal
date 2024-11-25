import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Customer } from '@app/customers/model';
import { computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { MessageService } from '@app/shared/ui-messaging';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { tapResponse } from '@ngrx/operators';

export interface CustomersState {
  customers: Customer[];
  page: number;
  total: number;
  selectedId: number | undefined;
  isLoaded: boolean;
  hasError: boolean;
}

export const initialState: CustomersState = {
  customers: [],
  page: 0,
  total: 0,
  selectedId: undefined,
  isLoaded: false,
  hasError: false,
};

const baseUrl = '/customer';

export const CustomersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => {
    return {
      selectedCustomer: computed(() => {
        const selectedId = state.selectedId();
        return state.customers().find((customer) => customer.id === selectedId);
      }),
      pagedCustomers: computed(() => {
        const customers = state.customers();
        const selectedId = state.selectedId();
        const page = state.page();
        const total = state.total();

        return {
          customers: customers.map((customer) => ({
            ...customer,
            selected: customer.id === selectedId,
          })),
          page,
          total,
        };
      }),
    };
  }),

  withMethods((store, httpClient = inject(HttpClient)) => {
    const _load = rxMethod<number>(
      switchMap((page) => {
        patchState(store, { customers: [], total: 0, isLoaded: false });
        return httpClient
          .get<{ content: Customer[]; total: number }>(baseUrl, {
            params: new HttpParams().set('page', page),
          })

          .pipe(
            tapResponse({
              next: ({ content, total }) =>
                patchState(store, {
                  total,
                  customers: content,
                  isLoaded: true,
                }),
              error: () => {
                patchState(store, { hasError: true });
              },
            }),
          );
      }),
    );

    return {
      _load,
      init() {
        if (store.isLoaded()) {
          return;
        }

        _load(0);
      },
      get(page: number) {
        const currentPage = store.page();
        if (page === currentPage) {
          return;
        }

        _load(page);
      },
    };
  }),

  withMethods((store) => {
    const http = inject(HttpClient);
    const router = inject(Router);
    const uiMessage = inject(MessageService);

    return {
      async add(customer: Customer) {
        await lastValueFrom(http.post(baseUrl, customer));
        router.navigateByUrl('/customers');
        store._load(0);
      },
      async update(
        customer: Customer,
        forward: string,
        message: string,
        callback?: () => void,
      ) {
        await lastValueFrom(http.put(baseUrl, customer));
        if (callback) {
          callback();
        }
        uiMessage.info(message);
        router.navigateByUrl(forward);
        store._load(0);
      },
      async remove(customer: Customer) {
        await lastValueFrom(http.delete(`${baseUrl}/${customer.id}`));
        router.navigateByUrl('/customers');
        store._load(0);
      },
      select(id: number) {
        patchState(store, { selectedId: id });
      },
      unselect() {
        patchState(store, { selectedId: undefined });
      },
      findById: (id: number) => {
        return computed(() => store.customers().find((p) => p.id === id));
      },
    };
  }),
);
