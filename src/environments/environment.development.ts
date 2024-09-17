import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
  providers: [provideStoreDevtools({ connectInZone: true })],
};
