import { bootstrapApplication } from '@angular/platform-browser';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';
import { appConfig } from './app/app-config';
import { App } from './app/app';

registerLocaleData(localeDe, 'de-AT');
void bootstrapApplication(App, appConfig);
