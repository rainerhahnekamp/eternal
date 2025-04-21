import { bootstrapApplication } from '@angular/platform-browser';
import localeDe from '@angular/common/locales/de-AT';
import { registerLocaleData } from '@angular/common';
import { appConfig } from './app/app.config';
import { SewerLocatorComponent } from './app/sewer-finder/sewer-locator.component';

registerLocaleData(localeDe, 'de-AT');

bootstrapApplication(SewerLocatorComponent, appConfig);
