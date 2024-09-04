import { Page } from "@playwright/test";
import { HolidaysPageObject } from "./holidays.page-object";
import { CustomersPageObject } from "./customers.page-object";


export class SidemenuPageObject {
    constructor(private page: Page) { }

    clickMenuItem(name: 'Holidays'): Promise<HolidaysPageObject>;
    clickMenuItem(name: 'Customers'): Promise<CustomersPageObject>;
    async clickMenuItem(name: 'Holidays' | 'Customers'): Promise<CustomersPageObject | HolidaysPageObject> {
        await this.page.getByRole('link', { name, exact: true }).click();

        return name === 'Holidays' ? new HolidaysPageObject(this.page) : new CustomersPageObject(this.page)
    }
}