import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync } from '@angular/core/testing';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { asyncScheduler, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentModule } from './request-info.component.module';

describe('Request Info Spectator', () => {
  const inputSelector = '[data-testid=address]';
  const buttonSelector = '[data-testid=btn-search]';
  const lookupSelector = '[data-testid=lookup-result]';

  describe('Component Test', () => {
    const createComponent = createComponentFactory({
      component: RequestInfoComponent,
      imports: [RequestInfoComponentModule],
      mocks: [AddressLookuper],
      declareComponent: false
    });

    const setup = () => {
      const spectator = createComponent();
      const lookuperMock = spectator.inject(AddressLookuper);
      return { spectator, lookuperMock };
    };

    it('should instantiate', () => {
      const { spectator } = setup();
      expect(spectator.component).toBeInstanceOf(RequestInfoComponent);
    });

    it('should find an address', fakeAsync(() => {
      const { spectator, lookuperMock } = setup();

      lookuperMock.lookup.mockImplementation((query) =>
        scheduled([query === 'Domgasse 5'], asyncScheduler)
      );

      spectator.typeInElement('Domgasse 15', inputSelector);
      spectator.click(buttonSelector);
      spectator.tick();
      const messageBox = spectator.query(lookupSelector);
      expect(messageBox).toHaveText('Address not found');

      spectator.typeInElement('Domgasse 5', inputSelector);
      spectator.click(buttonSelector);
      spectator.tick();
      expect(messageBox).toHaveText('Brochure sent');
    }));
  });

  describe('Integration Test', () => {
    const createComponent = createComponentFactory({
      component: RequestInfoComponent,
      imports: [RequestInfoComponentModule, HttpClientTestingModule],
      declareComponent: false
    });

    it('should instantiate', () => {
      const spectator = createComponent();
      expect(spectator.component).toBeInstanceOf(RequestInfoComponent);
    });

    it('should find address "Domgasse 5"', fakeAsync(() => {
      const spectator = createComponent();
      spectator.typeInElement('Domgasse 5', inputSelector);
      spectator.click(buttonSelector);

      const request = spectator
        .inject(HttpTestingController)
        .expectOne((req) => req.url.match(/nominatim/));
      request.flush([true]);

      spectator.detectChanges();
      expect(spectator.query(lookupSelector)).toHaveText('Brochure sent');
    }));
  });
});
