import { Page } from '@playwright/test'

export class Sidebar {
    constructor(private page: Page) {

    }

    async open(name: 'Customers' | 'Holidays') {
        await this.page.getByRole('link', { name, exact: true }).click();
    }
}