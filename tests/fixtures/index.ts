import { mergeTests } from '@playwright/test';
import { test as holidaysTest } from './holidays-fixtures';
import { test as mainTest } from './main-fixtures';

export const test = mergeTests(holidaysTest, mainTest);
