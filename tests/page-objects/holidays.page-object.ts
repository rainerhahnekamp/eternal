
import { Page } from "@playwright/test";


export class HolidaysPageObject {
    constructor(private page: Page) { }

    async requestBrochure(holiday: string) {
        await this.page.getByLabel(holiday).getByRole('link', {name: /Brochure/}).click();
    }
}