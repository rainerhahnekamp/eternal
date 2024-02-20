import { Page } from '@playwright/test';

export class HolidaysPage {
  constructor(private page: Page) {}

  async getBrochureFor(holiday: string) {
    await this.page
      .getByLabel(holiday)
      .getByRole('link', { name: 'Get a Brochure' })
      .click();
  }
}
