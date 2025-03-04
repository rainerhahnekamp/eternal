import { bootstrapApplication } from '@angular/platform-browser';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Sentry from '@sentry/angular';

registerLocaleData(localeDe, 'de-AT');

Sentry.init({
  dsn: 'https://c97a01c3ba2cb3c647ecd6ff15a3be52@o4508916509114368.ingest.de.sentry.io/4508920736055376',
  integrations: [],
});

bootstrapApplication(AppComponent, appConfig);
