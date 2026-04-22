import { mergeTests } from '@playwright/test';
import { holidaysTest } from './holidays-fixtures';
import { shellTests } from './shell-fixtures';

export const baseTests = mergeTests(holidaysTest, shellTests);
