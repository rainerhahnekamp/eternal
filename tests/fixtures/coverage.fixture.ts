import { Fixture } from './fixture';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

declare global {
  interface Window {
    __coverage__: Record<string, unknown>;
  }
}

export type CoverageFixture = {
  task: () => void;
};

export const coverageFixture: Fixture<CoverageFixture> = {
  task: [
    async ({ page }, use) => {
      await use(() => void true);
      const coverage = await page.evaluate(() => window.__coverage__);
      await writeFile(
        path.join(process.cwd(), 'nyc', `${crypto.randomUUID()}.json`),
        JSON.stringify(coverage),
      );
    },
    { auto: true },
  ],
};
