import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { deAT } from 'date-fns/locale';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { QuizComponent } from './quiz/feature/quiz.component';
import { BookingComponent } from './booking/feature/booking.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([])),
    provideRouter([
      { path: 'quiz', component: QuizComponent },
      { path: 'booking', component: BookingComponent },
    ]),
    importProvidersFrom([MatDateFnsModule]),
    {
      provide: MAT_DATE_LOCALE,
      useValue: deAT,
    },
    { provide: LOCALE_ID, useValue: 'de-AT' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
};
