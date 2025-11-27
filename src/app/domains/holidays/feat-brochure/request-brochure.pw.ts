import { test, expect } from '@testronaut/angular';
import { RequestBrochurePage } from './request-brochure-page';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

test.describe('Request Brochure', () => {
  test('should find the address', async ({ page, runInBrowser }) => {
    await runInBrowser('known address', () => {
      TestBed.configureTestingModule({
        providers: [provideRouter([])],
      }).createComponent(RequestBrochurePage);
    });

    await page.route(
      'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Domgasse%205',
      (route) => {
        route.fulfill({
          status: 200,
          json: [true],
        });
      },
    );
    await page.getByRole('textbox', { name: 'Address' }).fill('Domgasse 5');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByRole('status')).toContainText('Brochure sent');
  });

  test('should not find the address', async ({ page, runInBrowser }) => {
    await runInBrowser('unknown address', () => {
      TestBed.configureTestingModule({
        providers: [provideRouter([])],
      }).createComponent(RequestBrochurePage);
    });

    await page.route(
      'https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=Domgasse%205',
      (route) => {
        route.fulfill({
          status: 200,
          json: [],
        });
      },
    );
    await page.getByRole('textbox', { name: 'Address' }).fill('Domgasse 5');
    await page.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByText('Address not found')).toBeVisible();
  });
});
