await page.goto('http://localhost:4200/');
await page.getByTestId('btn-holidays').click();
await page.getByText('Bali', { exact: true }).click();
await page.getByLabel('Bali').getByTestId('btn-brochure').click();
await expect(page.locator('#holiday-card-16')).toContainText('Bali');