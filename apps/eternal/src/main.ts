import { enableProdMode, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './app/core/base-url.interceptor';
import { loadingInterceptor } from './app/core/loading.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';
import { provideStore } from '@ngrx/store';
import { securityProviders } from './app/security/security.providers';
import { sharedProviders } from './app/shared/shared.providers';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AuthModule } from '@auth0/auth0-angular';
import { Configuration } from './app/shared/configuration';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { deAT } from 'date-fns/locale';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeDe, 'de-AT');

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideStore(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([baseUrlInterceptor, loadingInterceptor])),
    provideStoreDevtools(),
    ...securityProviders,
    ...sharedProviders,
    importProvidersFrom([
      AuthModule.forRoot({
        domain: 'dev-xbu2-fid.eu.auth0.com',
        clientId: 'YgUoOMh2jc4CQuo8Ky9PS7npW3Q4ckX9'
      }),
      MatDateFnsModule
    ]),
    {
      provide: MAT_DATE_LOCALE,
      useValue: deAT
    },

    { provide: LOCALE_ID, useValue: 'de-AT' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    { provide: Configuration, useValue: new Configuration(environment.baseUrl, true, false) }
  ]
});
