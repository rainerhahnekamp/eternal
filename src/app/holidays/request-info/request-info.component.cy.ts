import { RequestInfoComponent } from './request-info.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mount } from 'cypress/angular';
import { provideStore } from '@ngrx/store';
import { Configuration } from '@app/shared';
import { provideRouter } from '@angular/router';
import { provideHolidays } from '@app/holidays/+state';
import { asyncScheduler, scheduled } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('Request Info Component', () => {
  for (const { message, response } of [
    { message: 'Address not found', response: [] },
    { message: 'Brochure sent', response: [true] },
  ]) {
    it(`should intercept the network and return ${response} for ${message}`, () => {
      const httpClient = { get: () => scheduled([response], asyncScheduler) };

      mount(`<app-request-info address="Domgasse 5" />`, {
        imports: [RequestInfoComponent, NoopAnimationsModule],
        providers: [
          provideRouter([]),
          provideStore(),
          provideHolidays,
          {
            provide: Configuration,
            useValue: { baseUrl: 'http://localhost:4200' },
          },
          { provide: HttpClient, useValue: httpClient },
        ],
      });

      cy.testid('ri-address').should('have.value', 'Domgasse 5');
      cy.testid('ri-search').click();
      cy.testid('ri-message').should('have.text', message);
    });
  }
});
