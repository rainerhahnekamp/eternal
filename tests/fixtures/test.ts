import { enginesTest } from 'tests/engines/engines';
import { sidemenuTest } from './sidemenu-fixtures';
import { mergeTests } from '@playwright/test';
import { holidaysTest } from './holidays-fixtures';

export const test = mergeTests(sidemenuTest, enginesTest, holidaysTest);
