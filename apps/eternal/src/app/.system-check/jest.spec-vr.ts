describe('Jest with Puppeteer', () => {
  it('should run Jest with Puppeteer', async () => {
    await page.goto('http://www.google.com');
    expect(true).toBe(true);
  });
});
