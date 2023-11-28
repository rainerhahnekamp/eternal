import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';
import { appConfig } from '@app/app.config';
import { KeycloakService } from 'keycloak-angular';

registerLocaleData(localeDe, 'de-AT');

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://auth.eternal-holidays.net:8443/',
        realm: 'eternal',
        clientId: 'account',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    // {
    //   provide: APP_INITIALIZER,
    //   multi: true,
    //   useFactory: initializeKeycloak,
    //   deps: [KeycloakService],
    // },
    // importProvidersFrom(KeycloakAngularModule),
  ],
});
