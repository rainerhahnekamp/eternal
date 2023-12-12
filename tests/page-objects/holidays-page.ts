import { Page } from '@playwright/test';

export class HolidaysPage {
  constructor(private page: Page) {}

  async getBrochureFor(holiday: string) {
    await this.page
      .locator('app-holiday-card', { hasText: holiday })
      .getByTestId('btn-brochure')
      .click();
  }
}
