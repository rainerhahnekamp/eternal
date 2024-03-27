import { mergeTests } from '@playwright/test';
import { holidaysTest } from './holidaysFixtures';
import { shellTest } from './shellFixtures';

export const test = mergeTests(shellTest, holidaysTest);
