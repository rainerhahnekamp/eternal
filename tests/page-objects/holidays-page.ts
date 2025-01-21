import { Page } from '@playwright/test';

export class HolidaysPage {
  constructor(private page: Page) {}

  async gotoBrochure(holidayName: string) {
    await this.page
      .getByLabel(holidayName)
      .getByRole('link', { name: 'Brochure' })
      .click();
  }
}
