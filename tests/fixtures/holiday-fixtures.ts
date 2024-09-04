import { test } from '@playwright/test'
import { HolidaysPageObject } from "tests/page-objects/holidays.page-object";

export type HolidayFixtures = {
    holidaysPageObject: HolidaysPageObject
}


export const holidayTest = test.extend<HolidayFixtures>({
    async holidaysPageObject({ page }, use) {
        await use(new HolidaysPageObject(page))
    }
})