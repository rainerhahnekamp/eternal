import { bootstrapApplication } from '@angular/platform-browser';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { enableProfiling } from '@angular/core';

enableProfiling();
registerLocaleData(localeDe, 'de-AT');
void bootstrapApplication(AppComponent, appConfig);
