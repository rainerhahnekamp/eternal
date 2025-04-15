import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { IMAGE_CONFIG } from '@angular/common';

import { Configuration } from './shared/config/configuration';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { baseUrlInterceptor } from './shared/http/base-url.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync(),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
    provideStore(),
    provideRouter(appRoutes),
    provideHttpClient(withFetch(), withInterceptors([baseUrlInterceptor])),
    ...environment.providers,
    {
      provide: Configuration,
      useValue: new Configuration(environment.baseUrl, true, false),
    },
  ],
};
