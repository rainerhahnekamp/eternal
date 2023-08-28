import { test } from '@playwright/test';

export type Fixture<FixtureType extends Record<string, unknown>> = Parameters<
  typeof test.extend<FixtureType>
>[0];
