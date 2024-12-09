import { mergeTests } from '@playwright/test';
import { testWithHolidays } from './fixtures/holidays-fixtures';
import { testWithSidemenu } from './fixtures/sidemenu-fixtures';
import { engines } from './engines/engines';

export const test = mergeTests(testWithHolidays, testWithSidemenu, engines);
