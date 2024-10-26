import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
  baseUrl: 'https://api.eternal-holidays.net',
  // baseUrl: 'http://localhost:8080',
  providers: [provideStoreDevtools({ connectInZone: true })],
};
