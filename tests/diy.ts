import { chromium } from '@playwright/test';

console.log('starting browser');
const browser = await chromium.launch({ headless: false });
console.log('starting context');
const context = await browser.newContext({
  locale: 'es-mx',
  timezoneId: 'America/Mexico_City',
  geolocation: { longitude: -88.56877, latitude: 20.68298 },
  permissions: ['geolocation'],
});
const page = await context.newPage();

await page.goto('http://localhost:4200');
await page.getByText('bienvenidos').waitFor();
await page.screenshot({ fullPage: true, path: 'diy.png' });

process.exit();
