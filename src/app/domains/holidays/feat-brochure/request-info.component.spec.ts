import { render } from '@testing-library/angular';
import { RequestInfoComponent } from './request-info.component';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';

describe('Request Info', () => {
  const setup = async () => {
    const renderResult = await render(RequestInfoComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    renderResult.fixture.autoDetectChanges();
    const user = userEvent.setup();
    const ctrl = TestBed.inject(HttpTestingController);

    return { ...renderResult, user, screen, ctrl };
  };

  it('should instantiate', async () => {
    await setup();
  });

  for (const { message, response } of [
    { message: 'Brochure sent', response: [true] },
    {
      message: 'Address not found',
      response: [],
    },
  ]) {
    it(`should show ${message} for response ${response}`, async () => {
      const { user, screen, ctrl, fixture } = await setup();

      await user.type(
        screen.getByRole('textbox', { name: 'Address' }),
        'Domgasse 5',
      );
      await user.click(screen.getByRole('button', { name: 'Send' }));
      ctrl
        .expectOne(
          'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Domgasse%205',
        )
        .flush(response);

      await fixture.whenStable();

      expect(screen.getByRole('status').textContent).toContain(message);
    });
  }
});
