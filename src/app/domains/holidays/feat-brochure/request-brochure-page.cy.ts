import { provideHttpClient } from '@angular/common/http';
import { mount } from 'cypress/angular';
import { provideRouter } from '@angular/router';
import { RequestBrochurePage } from './request-brochure-page';
import {
  AddressLookuperFake,
  provideAddressLookuperFake,
} from './internal/address-lookuper-fake';
import { TestBed } from '@angular/core/testing';

describe('Request Info Page', () => {
  for (const { message, response } of [
    { message: 'Brochure sent', response: true },
    { message: 'Address not found', response: false },
  ]) {
    it(`should intercept the network and return ${response} for ${message}`, () => {
      mount(RequestBrochurePage, {
        providers: [
          provideHttpClient(),
          provideRouter([]),
          provideAddressLookuperFake(),
        ],
      });

      cy.findByRole('textbox', { name: 'Address' })
        .type('Domgasse 5')
        .then(() =>
          TestBed.inject(AddressLookuperFake).resolveToValueForNextCall(
            response,
          ),
        );
      cy.findByRole('button', { name: 'Send' }).click();
      cy.findByRole('status').should('contain', message);
    });
  }
});
