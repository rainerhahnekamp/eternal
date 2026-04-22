import { Page } from '@playwright/test';

export class HolidaysPageObject {
  constructor(private page: Page) {}

  async requestBrochureFor(holiday: string) {
    await this.page
      .getByTestId('holiday-card')
      .filter({ hasText: holiday })
      .getByTestId('btn-brochure')
      .click();
  }
}
