import { enableProdMode, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BaseUrlInterceptor } from './app/core/base-url.interceptor';
import { LoadingInterceptor } from './app/core/loading.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SharedModule } from './app/shared/shared.module';
import { FormlyModule } from '@ngx-formly/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';
import { SecurityModule } from './app/security/security.module';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeDe, 'de-AT');

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(appRoutes),
    importProvidersFrom([
      HttpClientModule,
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      StoreDevtoolsModule.instrument(),
      SharedModule,
      SecurityModule,
      FormlyModule.forRoot({
        extras: { lazyRender: true },
        validationMessages: [
          {
            name: 'required',
            message: 'This field is mandatory'
          }
        ]
      })
    ]),
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'de-AT'
    },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: BaseUrlInterceptor },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: LoadingInterceptor },
    { provide: LOCALE_ID, useValue: 'de-AT' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    }
  ]
});
