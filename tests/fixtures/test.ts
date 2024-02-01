import { mergeTests } from '@playwright/test';
import { customersTest } from './customers-test';
import { shellTest } from './shell-tests';
import { siblingEngineTest } from 'tests/engines/sibling-engine';

export const test = mergeTests(shellTest, customersTest, siblingEngineTest);