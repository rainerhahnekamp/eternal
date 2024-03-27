import { expect } from '@playwright/test';

export const softExpect = expect.configure({ soft: true });
