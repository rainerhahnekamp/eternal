import { RequestInfoComponent } from './request-info.component';
import { render, screen } from '@testing-library/angular';
import { provideMock } from '@testing-library/angular/jest-utils';
import { AddressLookuper } from '@app/holidays/feature/address-lookuper.service';
import { Configuration } from '@app/shared/config';
import { userEvent } from '@testing-library/user-event';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { asyncScheduler, scheduled } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('Request Info with Testing Library', () => {
  describe('Component Tests', () => {
    const setup = async () => {
      const renderResult = await render(RequestInfoComponent, {
        providers: [
          provideMock(AddressLookuper),
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

    for (const { input, message } of [
      { input: 'Domgasse 5', message: 'Brochure sent' },
      { input: 'Domgasse 15', message: 'Address not found' },
    ]) {
      it(`should show ${message} for ${input}`, waitForAsync(async () => {
        const { user } = await setup();
        const lookuper = TestBed.inject(AddressLookuper);
        jest
          .spyOn(lookuper, 'lookup')
          .mockImplementation((query) =>
            scheduled([query === 'Domgasse 5'], asyncScheduler),
          );

        await user.type(screen.getByLabelText('Address'), input);
        await user.click(screen.getByRole('button', { name: 'Send' }));

        expect(await screen.findByText(message)).toBeTruthy();
      }));
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
