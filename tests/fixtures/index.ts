import { mergeTests } from '@playwright/test';
import { baseTests } from './base';
import { utilityTests } from './utility/profiler';

export const test = mergeTests(baseTests, utilityTests);
