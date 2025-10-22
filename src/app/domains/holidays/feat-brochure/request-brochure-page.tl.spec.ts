import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { expect, it, describe } from 'vitest';
import { Configuration } from '../../../shared/config/configuration';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { RequestBrochurePage } from './request-brochure-page';
import { RequestBrochureHarness } from './request-brochure.harness';
import {
  AddressLookuperFake,
  provideAddressLookuperFake,
} from './internal/address-lookuper-fake';

describe('Request Info with Testing Library', () => {
  describe('Component Tests', () => {
    const setup = async () => {
      const renderResult = await render(RequestBrochurePage, {
        providers: [
          provideAddressLookuperFake(),
          {
            provide: Configuration,
            useValue: { baseUrl: 'http://localhost:4200' },
          },
        ],
      });
      const user = userEvent.setup();
      const lookuperFake = TestBed.inject(AddressLookuperFake);

      return { ...renderResult, user, lookuperFake };
    };

    it('should instantiate', async () => {
      const renderResult = await setup();
      expect(renderResult.fixture.componentInstance).toBeInstanceOf(
        RequestBrochurePage,
      );
    });

    for (const { isValid, message } of [
      { isValid: true, message: 'Brochure sent' },
      { isValid: false, message: 'Address not found' },
    ]) {
      it(`should show ${message} for resource being ${isValid}`, async () => {
        const { user, lookuperFake } = await setup();

        await user.type(
          screen.getByRole('textbox', { name: 'Address' }),
          'Domgasse 5',
        );
        lookuperFake.resolveToValueForNextCall(isValid);

        await user.click(screen.getByRole('button', { name: 'Send' }));
        expect((await screen.findByRole('status')).textContent).toContain(
          message,
        );
      });
    }
  });

  describe('Integration Test', () => {
    const setup = async () => {
      const renderResult = await render(RequestBrochurePage, {
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
        RequestBrochurePage,
      );
    });

    for (const { input, message, response } of [
      { input: 'Domgasse 5', message: 'Brochure sent', response: [true] },
      { input: 'Domgasse 15', message: 'Address not found', response: [] },
    ]) {
      it(`should show ${message} for ${input}`, async () => {
        const { user } = await setup();

        await user.type(
          screen.getByRole('textbox', { name: 'Address' }),
          input,
        );
        await user.click(screen.getByRole('button', { name: 'Send' }));

        TestBed.inject(HttpTestingController)
          .expectOne((req) => !!req.url.match(/nominatim/))
          .flush(response);

        expect((await screen.findByRole('status')).textContent).toContain(
          message,
        );
      });
    }
  });

  describe('Harness Support', () => {
    const setup = async () => {
      const renderResult = await render(RequestBrochurePage, {
        providers: [
          provideAddressLookuperFake(),
          {
            provide: Configuration,
            useValue: { baseUrl: 'http://localhost:4200' },
          },
        ],
      });
      const harness = await TestbedHarnessEnvironment.harnessForFixture(
        renderResult.fixture,
        RequestBrochureHarness,
      );
      const user = userEvent.setup();
      const lookuperFake = TestBed.inject(AddressLookuperFake);

      return { ...renderResult, user, harness, lookuperFake };
    };

    it('should instantiate', async () => {
      const renderResult = await setup();
      expect(renderResult.fixture.componentInstance).toBeInstanceOf(
        RequestBrochurePage,
      );
    });

    for (const { input, message, isValid } of [
      { input: 'Domgasse 5', message: 'Brochure sent', isValid: true },
      { input: 'Domgasse 15', message: 'Address not found', isValid: false },
    ]) {
      it(`should show ${message} for ${input}`, async () => {
        const { harness, fixture, lookuperFake } = await setup();

        await harness.writeAddress(input);
        lookuperFake.resolveToValueForNextCall(isValid);
        await harness.search();
        await fixture.whenStable();

        expect(await harness.getResult()).toContain(message);
      });
    }
  });
});
