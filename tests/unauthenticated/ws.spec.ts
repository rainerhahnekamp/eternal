import { expect, test } from '@playwright/test';

test('Web Socket', async ({ page }) => {
  await page.goto('');
  await page.getByText('Application is ready').waitFor();
  await page.evaluate(() => (window.e2e = true));
  page.on('websocket', (ws) => {
    ws.on('framereceived', (event) =>
      console.log(`Websocket received: ${event.payload}`),
    );
  });
  await page.getByRole('button', { name: 'Enable Chat' }).click();
  await page.evaluate(() => {
    const mockedClient = window.mockedClient;
    if (mockedClient) {
      mockedClient({ message: 'Hello from Playwright' });
    }
  });
  await page.getByRole('link', { name: 'Chat' }).click();

  await expect(page.getByTestId('chat-message')).toContainText(
    'Hello from Playwright',
  );
});
