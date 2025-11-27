import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { IMAGE_CONFIG } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { deAT } from 'date-fns/locale';
import { environment } from '../environments/environment';
import { appRoutes } from './app-routes';
import { DefaultErrorHandler } from './core/default-error-handler';
import { customersInterceptor } from './domains/customers/feature/customers.interceptor';
import { holidaysInterceptor } from './domains/holidays/api/holidays.interceptor';
import { Configuration } from './shared/config/configuration';
import { baseUrlInterceptor } from './shared/http/base-url.interceptor';
import { errorInterceptor } from './shared/http/error.interceptor';
import { sharedMasterDataProvider } from './shared/master-data/shared-master-data.provider';
import { securityInterceptor } from './shared/security/security-interceptor';
import { loadingInterceptor } from './shared/ui-messaging/loader/loading.interceptor';
import { sharedUiMessagingProvider } from './shared/ui-messaging/shared-ui-messaging.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
    provideStore(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        customersInterceptor,
        holidaysInterceptor,
        baseUrlInterceptor,
        loadingInterceptor,
        errorInterceptor,
        securityInterceptor,
      ]),
    ),
    ...environment.providers,
    ...sharedMasterDataProvider,
    ...sharedUiMessagingProvider,
    importProvidersFrom([MatDateFnsModule]),
    {
      provide: MAT_DATE_LOCALE,
      useValue: deAT,
    },
    { provide: LOCALE_ID, useValue: 'de-AT' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    { provide: ErrorHandler, useClass: DefaultErrorHandler },
    {
      provide: Configuration,
      useValue: new Configuration(environment.baseUrl, true, false),
    },
  ],
};
