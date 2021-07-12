import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { asyncScheduler, of, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { mock } from '../../shared/mock';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentHarness } from './request-info.harness.component';

describe('RequestInfo Component', () => {
  const testModuleMetadata: TestModuleMetadata = {
    declarations: [RequestInfoComponent],
    imports: [
      MatButtonModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      NoopAnimationsModule,
      ReactiveFormsModule
    ],
    providers: [{ provide: AddressLookuper, useValue: null }]
  };

  const createFixtureAndHarness = async (config: TestModuleMetadata = {}) => {
    const fixture = TestBed.configureTestingModule({
      ...testModuleMetadata,
      ...config
    }).createComponent(RequestInfoComponent);
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RequestInfoComponentHarness
    );
    return { fixture, harness };
  };

  it('should check the title', async () => {
    const { fixture } = await createFixtureAndHarness();

    const title = fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement;
    expect(title.textContent).toBe('Request More Information');

    fixture.componentInstance.title = 'Test Title';
    fixture.detectChanges();

    expect(title.textContent).toBe('Test Title');
  });

  it('should check input fields have right values', async () => {
    const { fixture } = await createFixtureAndHarness();
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.formGroup.patchValue({
      address: 'Hauptstraße 5'
    });
    const address = fixture.debugElement.query(By.css('[data-test=address]'))
      .nativeElement as HTMLInputElement;

    expect(address.value).toBe('Hauptstraße 5');
  });

  it('should fail on no input', async () => {
    const { fixture, harness } = await createFixtureAndHarness({
      providers: [
        {
          provide: AddressLookuper,
          useValue: {
            lookup: () => scheduled([false], asyncScheduler)
          }
        }
      ]
    });

    await harness.submit();
    expect(await harness.getResult()).toBe('Address not found');
  });

  it('should trigger search on click', async () => {
    const lookuper = { lookup: jest.fn(() => scheduled([false], asyncScheduler)) };
    const { harness } = await createFixtureAndHarness({
      providers: [
        {
          provide: AddressLookuper,
          useValue: lookuper
        }
      ]
    });

    await harness.submit();
    expect(lookuper.lookup).toHaveBeenCalled();
  });

  it('should check the snapshot', async () => {
    const { fixture } = await createFixtureAndHarness();
    expect(fixture).toMatchSnapshot();
  });

  it('should find an address', async () => {
    const lookuper = {
      lookup: (query: string) => scheduled([query === 'Domgasse 5'], asyncScheduler)
    };
    const { harness } = await createFixtureAndHarness({
      providers: [{ provide: AddressLookuper, useValue: lookuper }]
    });

    await harness.writeAddress('Domgasse 15');
    await harness.submit();
    expect(await harness.getResult()).toBe('Address not found');

    await harness.writeAddress('Domgasse 5');
    await harness.submit();
    expect(await harness.getResult()).toBe('Brochure sent');
  });

  it('should test as unit test', (done) => {
    const formBuilder = {
      group: () => ({ value: { address: 'Domgasse 5' } })
    };
    const lookuper = {
      lookup: (query: string) => scheduled([query === 'Domgasse 5'], asyncScheduler)
    };
    const component = new RequestInfoComponent(
      mock<FormBuilder>(formBuilder),
      mock<AddressLookuper>(lookuper)
    );

    component.ngOnInit();
    component.lookupResult$?.subscribe((message) => {
      expect(message).toBe('Brochure sent');
      done();
    });

    component.search();
  });

  it('should verify the address input two times', async () => {
    @Component({
      template: "<app-request-info [address]='address'></app-request-info>"
    })
    class WrapperComponent {
      address: string = 'Domgasse 5';
    }

    await createFixtureAndHarness({
      ...testModuleMetadata,
      declarations: [WrapperComponent, RequestInfoComponent]
    });
    const wrapperFixture = TestBed.createComponent(WrapperComponent);
    const field = wrapperFixture.debugElement.query(By.css('[data-test=address]'))
      .nativeElement as HTMLInputElement;

    wrapperFixture.componentInstance.address = 'Domgasse 5';
    wrapperFixture.detectChanges();
    expect(field.value).toBe('Domgasse 5');

    wrapperFixture.componentInstance.address = 'Domgasse 15';
    wrapperFixture.detectChanges();
    expect(field.value).toBe('Domgasse 15');
  });

  it('should do an integration test', async () => {
    const httpClient = mock<HttpClient>({ get: () => of([true]) });
    const { harness } = await createFixtureAndHarness({
      providers: [{ provide: HttpClient, useValue: httpClient }]
    });

    await harness.writeAddress('Domgasse 15');
    await harness.submit();
    expect(await harness.getResult()).toBe('Brochure sent');
  });

  it('should mock components', () => {
    // tslint:disable-next-line:component-selector
    @Component({ selector: 'mat-form-field', template: '' })
    class MatFormField {}

    // tslint:disable-next-line:component-selector
    @Component({ selector: 'mat-hint', template: '' })
    class MatHint {}

    // tslint:disable-next-line:component-selector
    @Component({ selector: 'mat-icon', template: '' })
    class MatIcon {}

    // tslint:disable-next-line:component-selector
    @Component({ selector: 'mat-label', template: '' })
    class MatLabel {}

    const fixture = TestBed.configureTestingModule({
      declarations: [RequestInfoComponent, MatFormField, MatHint, MatIcon, MatLabel],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookuper, useValue: null }]
    }).createComponent(RequestInfoComponent);

    fixture.detectChanges();
  });

  it('should mock components with ng-mocks', () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [
        RequestInfoComponent,
        MockComponent(MatFormField),
        MockComponent(MatHint),
        MockComponent(MatIcon),
        MockComponent(MatLabel)
      ],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookuper, useValue: null }]
    }).createComponent(RequestInfoComponent);

    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should only mock the HttpClient', async () => {
    const { harness } = await createFixtureAndHarness({
      imports: [...(testModuleMetadata.imports || []), HttpClientTestingModule],
      providers: []
    });
    const controller = TestBed.inject(HttpTestingController);

    await harness.writeAddress('Domgasse 5');
    await harness.submit();

    const [request] = controller.match((req) => !!req.url.match(/nominatim/));
    request.flush([[]]);

    expect(await harness.getResult()).toBe('Brochure sent');
  });
});
