import test from '@playwright/test';

export const utilityTests = test.extend<{ measuring: void }>({
  measuring: [
    async ({}, use) => {
      const begin = Date.now();
      await use();
      const end = Date.now();

      console.log(`running for ${end - begin}`);
    },
    { auto: true },
  ],
});
