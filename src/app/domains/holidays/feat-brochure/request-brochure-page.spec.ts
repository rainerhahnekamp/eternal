import { TestBed } from '@angular/core/testing';
import { RequestBrochurePage } from './request-brochure-page';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { screen } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';

/**
 * HttpTestingController
 * RouterTestingHarness
 * Testing Library
 */

describe('RequestBrochurePage', () => {
  for (const { message, addresses } of [
    { message: 'Brochure sent', addresses: [{}] },
    { message: 'Address not found', addresses: [] },
  ]) {
    it(`should show ${message} for ${addresses}`, async () => {
      // await render(RequestBrochurePage, {
      //   providers: [
      //     provideZonelessChangeDetection(),
      //     provideHttpClient(),
      //     provideHttpClientTesting(),
      //     provideRouter(
      //       [
      //         {
      //           path: 'holidays/request-brochure/:id',
      //           component: RequestBrochurePage,
      //         },
      //       ],
      //       withComponentInputBinding(),
      //     ),
      //     provideLocationMocks(),
      //   ],
      // });

      TestBed.configureTestingModule({
        imports: [RequestBrochurePage],
        providers: [
          provideZonelessChangeDetection(),
          provideHttpClient(),
          provideHttpClientTesting(),
          provideRouter(
            [
              {
                path: 'holidays/request-brochure/:id',
                component: RequestBrochurePage,
              },
            ],
            withComponentInputBinding(),
          ),
          provideLocationMocks(),
        ],
      });
      const { fixture } = await RouterTestingHarness.create(
        '/holidays/request-brochure/5',
      );
      const ctrl = TestBed.inject(HttpTestingController);
      // const loader = await TestbedHarnessEnvironment.loader(fixture);
      const user = userEvent.setup();

      // const inputHarness = await loader.getHarness(MatInputHarness);
      // await inputHarness.setValue('Schillerstrasse 1');

      await user.type(
        screen.getByRole('textbox', {
          name: /address/i,
        }),
        'Schillerstrasse 1',
      );

      await user.click(
        screen.getByRole('button', {
          name: /send/i,
        }),
      );

      ctrl
        .expectOne(
          'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Schillerstrasse%201',
        )
        .flush(addresses);

      const lookupResult = await screen.findByRole('status');
      expect(lookupResult.textContent).toContain(message);
    });
  }
});
