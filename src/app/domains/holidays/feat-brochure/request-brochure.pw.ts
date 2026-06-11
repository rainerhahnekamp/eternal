import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { test } from '@testronaut/angular';
import { Configuration } from '../../../shared/config/configuration';
import {
  AddressLookuperFake,
  provideAddressLookuperFake,
} from './internal/address-lookuper-fake';
import { RequestBrochurePage } from './request-brochure-page';

test('request brochure', async ({ inPage }) => {
  await inPage(async () => {
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
  });
});
