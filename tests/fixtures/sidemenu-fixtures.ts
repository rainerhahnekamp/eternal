import { SidemenuPageObject } from "tests/page-objects/sidemenu.page-object";
import { test } from '@playwright/test'

export type SidemenuFixtures = {
    sidemenuPageObject: SidemenuPageObject,
    log: string
    // ...other page objects
}


export const sidemenuTest = test.extend<SidemenuFixtures>(
    {
        async sidemenuPageObject({ page }, use) {
            console.log('instantiating...');
            await use(new SidemenuPageObject(page))
        },
        log: [
            async ({page}, use) => {
                console.log(new Date().getTime())
                await use('hallo')
                console.log(new Date().getTime())
            },
            {auto: true}
        ]
    })