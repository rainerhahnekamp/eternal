import test from "@playwright/test"
import { HolidaysPage } from "tests/page-objects/holidays-page"

export type HolidayFixtures = {
    holidaysPage: HolidaysPage
}

export const holidaysTest = test.extend<HolidayFixtures>({
    async holidaysPage({page}, use) {
        await use(new HolidaysPage(page));
    }
})