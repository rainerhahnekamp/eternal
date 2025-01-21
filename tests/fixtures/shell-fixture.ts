import test from '@playwright/test';
import { Shell } from 'tests/page-objects/shell';

export type ShellFixture = {
  shell: Shell;
};

export const shellTest = test.extend<ShellFixture>({
  async shell({ page }, use) {
    await use(new Shell(page));
  },
});
