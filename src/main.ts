import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';
import { appConfig } from '@app/app.config';
import { AuthModule } from '@auth0/auth0-angular';
import { importProvidersFrom } from '@angular/core';

registerLocaleData(localeDe, 'de-AT');

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    importProvidersFrom(
      AuthModule.forRoot({
        domain: 'dev-xbu2-fid.eu.auth0.com',
        clientId: 'YgUoOMh2jc4CQuo8Ky9PS7npW3Q4ckX9',
        authorizationParams: {
          redirect_uri: window ? window.location.origin : '',
        },
      }),
    ),
  ],
});
