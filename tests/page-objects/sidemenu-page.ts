import { Page } from '@playwright/test';

export class SidemenuPage {
  constructor(private page: Page) {}

  async open(item: 'holidays' | 'customers' | 'bookings' | 'newsletter') {
    // await this.page.getByTestId('btn-' + item).click();
    await this.page.getByTestId(`btn-${item}`).click();
  }
}
