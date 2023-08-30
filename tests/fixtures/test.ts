import { test as base } from '@playwright/test';
import {
  authenticatedFixture,
  AuthenticatedFixture,
} from './authenticated.fixture';

export const test = base.extend<AuthenticatedFixture>(authenticatedFixture);
