describe('Address Component - Visual Regression', () => {
  it('should be true', () => {
    expect(true).toBeTruthy();
  });

  it('should make screenshot', async () => {
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  }, 10000);
});
