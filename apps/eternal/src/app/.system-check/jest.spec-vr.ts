describe('Jest with Puppeteer', () => {
  it('should run Jest with Puppeteer', async () => {
    await page.goto('http://www.datev.de');
    expect(true).toBe(true);
  });
});
