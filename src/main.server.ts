import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeDe, 'de-AT');

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
