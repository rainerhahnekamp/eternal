import { bootstrapApplication } from '@angular/platform-browser';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

registerLocaleData(localeDe, 'de-AT');

bootstrapApplication(AppComponent, appConfig);
