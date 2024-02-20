import { sidemenuFixture } from './sidemenu-fixture';
import { holidaysFixture } from './holidays-fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(sidemenuFixture, holidaysFixture);
