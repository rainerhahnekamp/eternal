import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  HomeLinkComponent,
  NewsletterComponent,
} from '@app/newsletter/newsletter.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { createMock } from '@testing-library/angular/jest-utils';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { NewsletterService } from '@app/newsletter/newsletter.service';
import { Component, inject, NO_ERRORS_SCHEMA } from "@angular/core";
import { provideRouter, RouterModule } from '@angular/router';
import { MockComponent } from "ng-mocks";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideLocationMocks } from "@angular/common/testing";
import { RouterTestingHarness } from "@angular/router/testing";

describe('Newsletter', () => {
  const setup = async (
    runChangeDetection = true,
    automaticChangeDetection = true,
  ) => {
    // const httpClient = createMock(HttpClient);
    TestBed.configureTestingModule({
      imports: [NewsletterComponent, MockComponent(HomeLinkComponent)], // = Template Abhängigkeiten (Component, Pipe, Directive)
      providers: [
        provideNoopAnimations(),
        provideHttpClient(), provideHttpClientTesting(),
        provideRouter([{path: 'newsletter', component: NewsletterComponent}]),
        provideLocationMocks()
      ], // == TypeScript Abhängigkeiten (Services)
    })

    const harness = await RouterTestingHarness.create('/newsletter')
    const fixture= harness.fixture;

    if (runChangeDetection) {
      harness.detectChanges()
    }

    if (automaticChangeDetection) {
      fixture.autoDetectChanges(true);
    }

    const httpCtrl = TestBed.inject(HttpTestingController)

    return { fixture, httpCtrl };
  };

  it('should instantiate', waitForAsync(async () => {
    const { fixture } = await setup();
    expect(fixture).toBeDefined();
  }));

  it('should not subscribe', waitForAsync(async () => {
    const { fixture } = await setup();
    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe'),
    ).nativeElement; // = cy.get

    button.click();
    fixture.detectChanges()

    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;

    expect(message.textContent).toBe('Please provide an email');
  }));

  it('should subscribe', waitForAsync(async () => {
    const { fixture, httpCtrl } = await setup(true, true);
    // httpClient.post.mockReturnValue(of(true).pipe(delay(0)));

    const input = document.querySelector(
      'input[data-testid=inp-email]',
    ) as HTMLInputElement;
    input.value = 'user@host.com';
    input.dispatchEvent(new Event('input')); // implizit CD (zone)

    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid=btn-subscribe'),
    ).nativeElement; // = cy.get

    button.click(); // implizit CD (zone)
    httpCtrl.expectOne('http://some.host.com/newsletter/subscribe').flush(true)
    await fixture.whenStable(); // implizit CD (zone)
    fixture.detectChanges()

    const message: HTMLParagraphElement = fixture.debugElement.query(
      By.css('[data-testid=p-message]'),
    ).nativeElement;

    expect(message.textContent).toBe('Thank you for your subscription');
  }));
});
