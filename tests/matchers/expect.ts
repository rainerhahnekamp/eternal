import { mergeExpects } from '@playwright/test';
import { toHaveMatIcon } from './to-have-mat-icon';

export const expect = mergeExpects(toHaveMatIcon);
