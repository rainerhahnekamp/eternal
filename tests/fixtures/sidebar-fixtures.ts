import test from "@playwright/test"
import { HolidaysPage } from "tests/page-objects/holidays-page"
import { Sidebar } from "tests/page-objects/sidebar"

export type SidebarFixtures = {
    sidebar: Sidebar
}

export const sidebarTest = test.extend<SidebarFixtures>({
    async sidebar({page}, use) {
        console.log('instantiating...');
        await use(new Sidebar(page));
    }
})