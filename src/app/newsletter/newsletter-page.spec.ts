import { ComponentFixtureAutoDetect, TestBed } from "@angular/core/testing"
import NewsletterPage from "./newsletter-page"
import { Configuration } from '../shared/config/configuration'
import { By } from "@angular/platform-browser"
import { page } from "vitest/browser"
import { screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { provideRouter } from "@angular/router"
import { Component } from "@angular/core"
import { HomeLinkComponent } from "./home-link"

const provideTestConfiguration = () => {
  const testConfiguration = {
    baseUrl: 'http://test'
  }
  return { provide: Configuration, useValue: testConfiguration }
}

@Component({
  selector: 'app-home-link',
  template: ``
})
export class MockedHomeLink { }

describe("Newsletter Page", () => {
  const setup = async () => {
    const testConfiguration = {
      baseUrl: 'http://test'
    }

    // TestBed.overrideComponent(NewsletterPage, {
    //   remove: { imports: [HomeLinkComponent] },
    //   add: { imports: [MockedHomeLink] }
    // })

    const fixture = TestBed.configureTestingModule({
      providers: [
        provideTestConfiguration(),
        provideRouter([])
        // { provide: ComponentFixtureAutoDetect, useValue: true } // <- automatisch bei zoneless
      ]
    }).createComponent(NewsletterPage)

    await fixture.whenStable();

    return fixture;
  }

  it('should instantiate', async () => setup())

  describe.skip('Full Browser Mode mit Playwright', () => {
    it('should show an error on missing email', async () => {
      await setup();
      await page.getByRole('button', { name: 'Subscribe' }).click()
      await expect.element(page.getByTestId('p-message')).toHaveTextContent('Please provide an email')
    })

    it('should show success message', async () => {
      await setup();
      await page.getByRole('textbox', { name: 'Address' }).fill('user@host.com')
      await page.getByRole('button', { name: 'Subscribe' }).click()
      await expect.element(page.getByTestId('p-message')).toHaveTextContent('Thank you for your subscription')
    })
  })

  describe('Testing Library', () => {
    it('should show an error on missing email', async () => {
      await setup();
      await userEvent.click(await screen.findByRole('button', { name: 'Subscribe' }))
      await expect.poll(() => screen.getByTestId('p-message')).toHaveTextContent('Please provide an email')
    })
  })
})