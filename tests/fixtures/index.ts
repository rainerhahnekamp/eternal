import { mergeTests } from '@playwright/test';
import { customersFixtures } from './customer.fixtures';
import { shellFixtures } from './shell.fixtures';

export const test = mergeTests(customersFixtures, shellFixtures);
