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

export type CustomersState = {
  customers: Customer[];
  page: number;
  total: number;
  selectedId: number | undefined;
  isLoaded: boolean;
  hasError: boolean;
};

export const initialState: CustomersState = {
  customers: [],
  page: 0,
  total: 0,
  selectedId: undefined,
  isLoaded: false,
  hasError: false,
};

const baseUrl = '/customers';

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

  withMethods((state) => {
    const http = inject(HttpClient);
    const router = inject(Router);
    const uiMessage = inject(MessageService);
    const load = (page: number) => {
      http
        .get<{ content: Customer[]; total: number }>(baseUrl, {
          params: new HttpParams().set('page', page),
        })
        .pipe()
        .subscribe({
          next: ({ content, total }) =>
            patchState(state, { total, customers: content, isLoaded: true }),
          error: () => patchState(state, { hasError: true }),
        });
    };
    const get = (page: number) => {
      const currentPage = state.page();
      if (page === currentPage) {
        return;
      }

      load(page);
    };
    const init = () => {
      if (state.isLoaded()) {
        return;
      }

      get(1);
    };

    return {
      get,
      init,
      async add(customer: Customer) {
        await lastValueFrom(http.post(baseUrl, customer));
        router.navigateByUrl('/customers');
        load(1);
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
        load(1);
      },
      async remove(customer: Customer) {
        await lastValueFrom(http.delete(`${baseUrl}/${customer.id}`));
        router.navigateByUrl('/customers');
        load(1);
      },
      select(id: number) {
        patchState(state, { selectedId: id });
      },
      unselect() {
        patchState(state, { selectedId: undefined });
      },
      findById: (id: number) => {
        return computed(() => state.customers().find((p) => p.id === id));
      },
    };
  }),
);
