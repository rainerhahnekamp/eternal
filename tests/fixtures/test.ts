import { test as base } from '@playwright/test';
import { coverageFixture, CoverageFixture } from './coverage.fixture';
import { shellFixtures, ShellFixtures } from './shell.fixtures';
import { CustomersFixtures, customersFixtures } from './customer.fixtures';

export const test = base
  .extend<CoverageFixture>(coverageFixture)
  .extend<ShellFixtures>(shellFixtures)
  .extend<CustomersFixtures>(customersFixtures);
