import { mergeTests } from '@playwright/test';
import { holidaysTest } from './holidays-fixtures';
import { shellTest } from './shell-fixture';
import { parentEngineTest } from 'tests/engines';

export const test = mergeTests(holidaysTest, shellTest, parentEngineTest);
