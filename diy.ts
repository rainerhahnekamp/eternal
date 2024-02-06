import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const context = await browser.newContext({
  timezoneId: 'IST',
  locale: 'de-AT',
  viewport: { width: 500, height: 500 },
});
const page = await context.newPage();

const response = page.waitForResponse((res) =>
  res.url().endsWith('ranada.jpg'),
);

await page.goto('http://localhost:4200');
await page.getByText('Application is ready').waitFor();
await page.getByTestId('btn-holidays').click();

await response;
await page
  .getByTestId('holiday-card')
  .filter({ hasText: 'Granada' })
  .scrollIntoViewIfNeeded();
await page.screenshot({ path: 'diy-small.png' });

process.exit();
