import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { deAT } from 'date-fns/locale';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { IMAGE_CONFIG } from '@angular/common';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { baseUrlInterceptor } from './shared/http/base-url.interceptor';
import { loadingInterceptor } from './shared/ui-messaging/loader/loading.interceptor';
import { errorInterceptor } from './shared/http/error.interceptor';
import { sharedMasterDataProvider } from './shared/master-data/shared-master-data.provider';
import { sharedUiMessagingProvider } from './shared/ui-messaging/shared-ui-messaging.provider';
import { Configuration } from './shared/config/configuration';
import { securityInterceptor } from './shared/security/security-interceptor';
import { ErrorHandlerService } from './core/error-handler.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay()),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
    provideStore(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
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
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    {
      provide: Configuration,
      useValue: new Configuration(environment.baseUrl, true, false),
    },
  ],
};
