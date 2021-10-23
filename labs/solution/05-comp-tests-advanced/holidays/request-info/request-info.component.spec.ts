import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { asyncScheduler, Observable, scheduled } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { assertType } from '../../shared/assert-type';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentHarness } from './request-info.component.harnes';
import { RequestInfoComponentModule } from './request-info.component.module';

describe('Request Info Component', () => {
  const noMaterialCheck = {
    provide: MATERIAL_SANITY_CHECKS,
    useValue: false
  };

  const setup = (config: TestModuleMetadata = {}) => {
    const lookupMock = jest.fn<Observable<boolean>, [string]>();
    const defaultConfig: TestModuleMetadata = {
      imports: [NoopAnimationsModule, RequestInfoComponentModule],
      providers: [
        {
          provide: AddressLookuper,
          useValue: { lookup: lookupMock }
        },
        noMaterialCheck
      ]
    };
    const fixture = TestBed.configureTestingModule({ ...defaultConfig, ...config }).createComponent(
      RequestInfoComponent
    );
    lookupMock.mockReset();

    return { fixture, lookupMock };
  };

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
    const { fixture, lookupMock } = setup();
    lookupMock.mockImplementation((query) => scheduled([query === 'Domgasse 5'], asyncScheduler));

    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RequestInfoComponentHarness
    );

    await harness.writeAddress('Domgasse 15');
    await harness.search();
    expect(await harness.getResult()).toBe('Address not found');

    await harness.writeAddress('Domgasse 5');
    await harness.search();
    expect(await harness.getResult()).toBe('Brochure sent');
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

    setup({ declarations: [WrapperComponent] });
    const fixture = TestBed.createComponent(WrapperComponent);

    const loader = await TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(RequestInfoComponentHarness);

    expect(await harness.getAddress()).toBe('Domgasse 15');
    fixture.componentInstance.address = 'Domgasse 5';
    expect(await harness.getAddress()).toBe('Domgasse 5');
  });
});
