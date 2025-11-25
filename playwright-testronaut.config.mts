import {
  defineConfig,
  devices,
  withTestronautAngular,
} from "@testronaut/angular";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig(
  withTestronautAngular({
    configPath: __filename,
    testServer: {
      command:
        "pnpm exec ng serve --configuration testronaut --live-reload false --port {port}",
    },
  }),
  /* Overriding all timeouts just for the fun of HAL shutdown sequence. */
  {
    timeout: 15_000,
    expect: {
      timeout: 15_000,
    },
    use: {
      actionTimeout: 15_000,
    },
  },
  {
    use: {
      trace: "on-first-retry",
    },
    /* Configure projects for major browsers */
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  },
);
