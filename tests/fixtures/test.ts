import { sidemenuTest } from './sidemenu-fixtures';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(sidemenuTest);
