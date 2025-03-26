import { test as base } from '@playwright/test'
import * as fs from 'fs/promises'

export const tokenCheckerTest = base.extend<{ tokenChecker: true }>({
    tokenChecker: [
        async ({ }, use) => {
            /**
             * code for verifying that tokens are  valid
             */
            // const filepath = __dirname + '/../../john-list.json';
            // console.log(filepath)
            // const content = await fs.readFile(filepath, { encoding: 'utf-8' })
            // console.log(content)

            await use(true);
        },
        { auto: true }]
})