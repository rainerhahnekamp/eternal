import { RequestInfoComponent } from './request-info.component';
import { render, screen } from '@testing-library/angular';
import { createMock } from '@testing-library/angular/jest-utils';
import { userEvent } from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { asapScheduler, scheduled } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Configuration } from '../../../shared/config/configuration';
import { AddressLookuper } from './internal/address-lookuper.service';

describe('Request Info with Testing Library', () => {
  describe('Component Tests', () => {
    const setup = async () => {
      const lookuper = createMock(AddressLookuper);
      const renderResult = await render(RequestInfoComponent, {
        providers: [
          { provide: AddressLookuper, useValue: lookuper },
          {
            provide: Configuration,
            useValue: { baseUrl: 'http://localhost:4200' },
          },
        ],
      });
      const user = userEvent.setup();

      return { ...renderResult, user, lookuper };
    };

    it('should instantiate', async () => {
      const renderResult = await setup();
      expect(renderResult.fixture.componentInstance).toBeInstanceOf(
        RequestInfoComponent,
      );
    });

    for (const { input, message } of [
      { input: 'Domgasse 5', message: 'Brochure sent' },
      { input: 'Domgasse 15', message: 'Address not found' },
    ]) {
      it(`should show ${message} for ${input}`, async () => {
        const { user, lookuper } = await setup();
        lookuper.lookup.mockImplementation((query) =>
          scheduled([query === 'Domgasse 5'], asapScheduler),
        );
        await user.type(screen.getByLabelText('Address'), input);
        await user.click(screen.getByRole('button', { name: 'Send' }));

        expect((await screen.findByRole('status')).textContent).toContain(
          message,
        );
      });
    }
  });

  describe('Integration Test', () => {
    const setup = async () => {
      const renderResult = await render(RequestInfoComponent, {
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: Configuration,
            useValue: { baseUrl: 'http://localhost:4200' },
          },
        ],
      });
      const user = userEvent.setup();

      return { ...renderResult, user };
    };

    it('should instantiate', async () => {
      const renderResult = await setup();
      expect(renderResult.fixture.componentInstance).toBeInstanceOf(
        RequestInfoComponent,
      );
    });

    for (const { input, message, response } of [
      { input: 'Domgasse 5', message: 'Brochure sent', response: [true] },
      { input: 'Domgasse 15', message: 'Address not found', response: [] },
    ]) {
      it(`should show ${message} for ${input}`, async () => {
        const { user } = await setup();

        await user.type(screen.getByLabelText('Address'), input);
        await user.click(screen.getByRole('button', { name: 'Send' }));

        TestBed.inject(HttpTestingController)
          .expectOne((req) => !!req.url.match(/nominatim/))
          .flush(response);

        expect(await screen.findByText(message)).toBeTruthy();
      });
    }
  });
});
