import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { describe, expect, it } from 'vitest';
import { Configuration } from '../../../shared/config/configuration';
import { RequestBrochurePage } from './request-brochure-page';
import {
  AddressLookuperFake,
  provideAddressLookuperFake,
} from './internal/address-lookuper-fake';
import { provideRouter } from '@angular/router';
import { page, userEvent as user } from 'vitest/browser';

describe('Request Info with Testing Library', () => {
  describe('Component Tests', () => {
    const setup = async () => {
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideAddressLookuperFake(),
          provideRouter([]),
          {
            provide: Configuration,
            useValue: { baseUrl: 'http://localhost:4200' },
          },
        ],
      }).createComponent(RequestBrochurePage);

      await fixture.whenStable();

      const lookuperFake = TestBed.inject(AddressLookuperFake);

      return lookuperFake;
    };

    it('should instantiate', async () => {
      await setup();

      expect(
        await screen.findByRole('heading', { level: 2 }),
      ).toHaveTextContent('Request a Brochure');
    });

    for (const { isValid, message } of [
      { isValid: true, message: 'Brochure sent' },
      { isValid: false, message: 'Address not found' },
    ]) {
      it(`should show ${message} for resource being ${isValid}`, async () => {
        const lookuperFake = await setup();

        lookuperFake.setResponseForQuery('Domgasse 5', isValid);
        await userEvent.type(
          screen.getByRole('textbox', { name: 'Address' }),
          'Domgasse 5',
        );
        await userEvent.click(screen.getByRole('button', { name: 'Send' }));

        if (isValid) {
          expect(await screen.findByRole('status')).toHaveTextContent(message);
        } else {
          expect(await screen.findByText('Address not found')).toBeVisible();
        }
      });
    }
  });

  describe('Integration Test', () => {
    const setup = async () => {
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideHttpClientTesting(),
          provideRouter([]),
          {
            provide: Configuration,
            useValue: { baseUrl: 'http://localhost:4200' },
          },
        ],
      }).createComponent(RequestBrochurePage);

      await fixture.whenStable();
    };

    it('should find an address by using the `HttpTestingController`', async () => {
      await setup();
      await userEvent.type(
        screen.getByRole('textbox', { name: 'Address' }),
        'Domgasse 5',
      );

      TestBed.inject(HttpTestingController)
        .expectOne((req) => !!req.url.match(/nominatim/))
        .flush([true]);

      await userEvent.click(screen.getByRole('button', { name: 'Send' }));

      expect(await screen.findByRole('status')).toHaveTextContent(
        'Brochure sent',
      );
    });
  });

  describe('Component Test in full browser mode', () => {
    const setup = async () => {
      TestBed.configureTestingModule({
        providers: [
          provideAddressLookuperFake(),
          provideRouter([]),
          {
            provide: Configuration,
            useValue: { baseUrl: 'http://localhost:4200' },
          },
        ],
      }).createComponent(RequestBrochurePage);

      const lookuperFake = TestBed.inject(AddressLookuperFake);
      return lookuperFake;
    };

    it('should instantiate', async () => {
      await setup();

      await expect
        .element(page.getByRole('heading', { level: 2 }))
        .toHaveTextContent('Request a Brochure');
    });

    for (const { isValid, message } of [
      { isValid: true, message: 'Brochure sent' },
      { isValid: false, message: 'Address not found' },
    ]) {
      it(`should show ${message} for resource being ${isValid}`, async () => {
        const lookuperFake = await setup();

        lookuperFake.setResponseForQuery('Domgasse 5', isValid);
        await user.type(
          page.getByRole('textbox', { name: 'Address' }),
          'Domgasse 5',
        );
        await user.click(page.getByRole('button', { name: 'Send' }));

        if (isValid) {
          await expect
            .element(page.getByRole('status'))
            .toHaveTextContent(message);
        } else {
          await expect
            .element(page.getByText('Address not found'))
            .toBeVisible();
        }
      });
    }
  });
});
