import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { Configuration } from '../../../shared/config/configuration';
import {
  AddressLookuperFake,
  provideAddressLookuperFake,
} from './internal/address-lookuper-fake';
import { RequestBrochurePage } from './request-brochure-page';

describe('Request Brochure', () => {
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

  it(`should show 'Brochure sent' on valid address'`, async () => {
    const lookuperFake = await setup();

    lookuperFake.setResponseForQuery('Domgasse 5', true);
    await page.getByRole('textbox', { name: 'Address' }).fill('Domgasse 5');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('Brochure sent');
  });

  it('should show error message next to form field on invalid address', async () => {
    const lookuperFake = await setup();

    lookuperFake.setResponseForQuery('Domgasse 5', true);
    await page.getByRole('textbox', { name: 'Address' }).fill('Domgasse 50');
    await userEvent.type(
      page.getByRole('textbox', { name: 'Address' }),
      '{Tab}',
    );

    await expect.element(page.getByText('Address not found')).toBeVisible();
  });
});
