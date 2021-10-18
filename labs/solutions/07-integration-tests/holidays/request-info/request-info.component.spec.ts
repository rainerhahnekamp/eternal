import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { asyncScheduler, Observable, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { assertType } from '../../shared/assert-type';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentHarness } from './request-info.component.harnes';

describe('Request Info Component', () => {
  const noMaterialCheck = {
    provide: MATERIAL_SANITY_CHECKS,
    useValue: false
  };
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
    providers: [{ provide: AddressLookuper, useValue: null }, noMaterialCheck]
  };

  const createFixture = (config: TestModuleMetadata = {}) =>
    TestBed.configureTestingModule({ ...testModuleMetadata, ...config }).createComponent(
      RequestInfoComponent
    );
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
      providers: [{ provide: AddressLookuper, useValue: null }, noMaterialCheck]
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
      providers: [{ provide: AddressLookuper, useValue: null }, noMaterialCheck]
    }).createComponent(RequestInfoComponent);

    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should find an address', async () => {
    const lookuper = {
      lookup: jest.fn<Observable<boolean>, [string]>((query) =>
        scheduled([query === 'Domgasse 5'], asyncScheduler)
      )
    };
    const fixture = TestBed.configureTestingModule({
      ...testModuleMetadata,
      ...{
        providers: [
          {
            provide: AddressLookuper,
            useValue: lookuper
          },
          noMaterialCheck
        ]
      }
    }).createComponent(RequestInfoComponent);

    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RequestInfoComponentHarness
    );

    await harness.writeAddress('Domgasse 15');
    await harness.submit();
    const message = await harness.getResult();
    expect(message).toBe('Address not found');
    await harness.writeAddress('Domgasse 5');
    await harness.submit();

    return expect(harness.getResult()).resolves.toBe('Brochure sent');
  });

  it(
    'should test as unit test',
    waitForAsync(() => {
      const formBuilder = {
        group: () => ({ value: { address: 'Domgasse 5' } })
      };
      const lookuper = {
        lookup: (query: string) => scheduled([query === 'Domgasse 5'], asyncScheduler)
      };
      const component = new RequestInfoComponent(
        assertType<FormBuilder>(formBuilder),
        assertType<AddressLookuper>(lookuper)
      );

      component.ngOnInit();
      component.lookupResult$?.subscribe((message) => {
        expect(message).toBe('Brochure sent');
      });

      component.search();
    })
  );

  it('should verify ngOnChanges with address', async () => {
    @Component({
      template: ` <app-request-info [address]="address"></app-request-info>`
    })
    class WrapperComponent {
      address = 'Domgasse 15';
    }

    createFixture({ declarations: [WrapperComponent, RequestInfoComponent] });
    const fixture = TestBed.createComponent(WrapperComponent);
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RequestInfoComponentHarness
    );

    expect(await harness.getAddress()).toBe('Domgasse 15');
    fixture.componentInstance.address = 'Domgasse 5';
    expect(await harness.getAddress()).toBe('Domgasse 5');
  });

  it('should only mock the HttpClient', async () => {
    const fixture = createFixture({
      imports: [...(testModuleMetadata.imports || []), HttpClientTestingModule],
      providers: [noMaterialCheck]
    });
    const controller = TestBed.inject(HttpTestingController);
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RequestInfoComponentHarness
    );

    await harness.writeAddress('Domgasse 5');
    await harness.submit();

    controller.expectOne((req) => !!req.url.match(/nominatim/)).flush([true]);

    expect(await harness.getResult()).toBe('Brochure sent');
  });
});
