import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app-config.server';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeDe, 'de-AT');

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
