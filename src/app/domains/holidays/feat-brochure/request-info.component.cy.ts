import { RequestInfoComponent } from './request-info.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mount } from 'cypress/angular';
import { provideRouter } from '@angular/router';
import { asyncScheduler, scheduled } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../../../shared/config/configuration';

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
          {
            provide: Configuration,
            useValue: { baseUrl: 'http://localhost:4200' },
          },
          { provide: HttpClient, useValue: httpClient },
        ],
      });

      cy.testid('address').should('have.value', 'Domgasse 5');
      cy.testid('btn-search').click();
      cy.testid('lookup-result').should('contain.text', message);
    });
  }
});
