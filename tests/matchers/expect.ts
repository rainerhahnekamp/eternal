import { expect as base } from '@playwright/test';

export const expect = base.configure({ soft: true });
