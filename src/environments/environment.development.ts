import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
  baseUrl: 'https://api.eternal-holidays.net',
  providers: [provideStoreDevtools({ connectInZone: true })],
};
