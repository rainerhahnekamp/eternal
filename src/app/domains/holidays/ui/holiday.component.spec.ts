import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { HolidayComponent, SubComponent } from './holiday.component';
import { createMock } from '@testing-library/angular/jest-utils';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { asyncScheduler, scheduled } from 'rxjs';
import { createHoliday } from '../model/holiday';
import { MockComponents } from 'ng-mocks';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideLocationMocks } from '@angular/common/testing';

// @Component({
//   selector: 'app-holiday-sub',
//   template: '',
// })
// class MockHolidaySubComponent {}

describe('Holiday', () => {
  describe('RouterTestingHarness', () => {
    it('use the router harness', async () => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: ComponentFixtureAutoDetect,
            useValue: true,
          },
          provideNoopAnimations(),
          provideRouter(
            [{ path: 'holiday/:id', component: HolidayComponent }],
            withComponentInputBinding(),
          ),
          provideLocationMocks(),
        ],
      });
      const harness = await RouterTestingHarness.create('/holiday/4');
      const ctrl = TestBed.inject(HttpTestingController);
      ctrl
        .expectOne('/holiday')
        .flush([createHoliday({ id: 4, title: 'Silkeborg' })]);

      await Promise.resolve();
      harness.fixture.detectChanges();

      const titleField: HTMLInputElement = screen.getByRole('textbox', {
        name: 'Holiday Title',
      });
      expect(titleField.value).toBe('Silkeborg');
    });
  });

  describe('HttpClientTestingController', () => {
    it('should do a request for holiday 4', async () => {
      await render(HolidayComponent, {
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: ComponentFixtureAutoDetect,
            useValue: true,
          },
          provideNoopAnimations(),
        ],
      });
      const ctrl = TestBed.inject(HttpTestingController);
      ctrl
        .expectOne('/holiday')
        .flush(createHoliday({ id: 4, title: 'Silkeborg' }));

      const user = userEvent.setup();
      const input: HTMLInputElement = screen.getByRole('textbox', {
        name: 'Holiday ID',
      });

      await user.clear(input);
      ctrl
        .expectOne('/holiday')
        .flush(createHoliday({ id: 4, title: 'Silkeborg' }));
      await user.type(input, '4');
      ctrl
        .expectOne('/holiday')
        .flush(createHoliday({ id: 4, title: 'Silkeborg' }));
      ctrl.verify();
    });
  });
  describe('Testing Library Setup', () => {
    it('should set the title via a wrapper component', async () => {
      const httpClient = createMock(HttpClient);

      await render(
        `<app-holiday title="Holidays in Denmark" finalDestination="Silkeborg" />`,
        {
          imports: [HolidayComponent],
          providers: [
            {
              provide: HttpClient,
              useValue: httpClient,
            },
            {
              provide: ComponentFixtureAutoDetect,
              useValue: true,
            },
            provideNoopAnimations(),
          ],
        },
      );

      const header: HTMLHeadElement = screen.getByRole('heading', { level: 3 });
      expect(header.textContent).toBe('Holidays in Denmark');
      expect(screen.getByRole('heading', { level: 4 }).textContent).toBe(
        'Silkeborg',
      );
    });
  });
  describe('TestBed Setup', () => {
    const setup = () => {
      const httpClient = createMock(HttpClient);

      // TestBed.overrideComponent(HolidayComponent, {
      //   remove: { imports: [SubComponent] },
      //   add: {schemas: [CUSTOM_ELEMENTS_SCHEMA]}
      //   // add: { imports: [MockHolidaySubComponent] },
      // });

      const fixture = TestBed.configureTestingModule({
        imports: [HolidayComponent, MockComponents(SubComponent)],
        providers: [
          {
            provide: HttpClient,
            useValue: httpClient,
          },
          {
            provide: ComponentFixtureAutoDetect,
            useValue: true,
          },
          provideNoopAnimations(),
        ],
      }).createComponent(HolidayComponent);
      // fixture.detectChanges();

      return { httpClient, fixture };
    };

    it('should instantiate', () => {
      setup();
    });

    it('should have 0 for the input', async () => {
      const { fixture, httpClient } = setup();

      const input: HTMLInputElement = screen.getByRole('textbox', {
        name: 'Holiday ID',
      });
      await fixture.whenStable();
      // await Promise.resolve()
      expect(input.value).toBe('0');
    });

    it('should do a request for holiday 4', async () => {
      const { fixture, httpClient } = setup();

      const user = userEvent.setup();
      const input: HTMLInputElement = screen.getByRole('textbox', {
        name: 'Holiday ID',
      });

      await user.clear(input);
      httpClient.get.mockReturnValue(
        scheduled(
          [[createHoliday({ id: 4, title: 'Silkeborg' })]],
          asyncScheduler,
        ),
      );
      await user.type(input, '4');
      await fixture.whenStable();

      const titleField: HTMLInputElement = screen.getByRole('textbox', {
        name: 'Holiday Title',
      });
      expect(titleField.value).toBe('Silkeborg');
    });

    it('should have a title Holidays in Denmark', async () => {
      const { fixture, httpClient } = setup();

      const header: HTMLHeadElement = screen.getByRole('heading', { level: 3 });
      fixture.componentRef.setInput('title', 'Holidays in Denmark');
      await fixture.whenStable();
      expect(header.textContent).toBe('Holidays in Denmark');
    });
  });
});
