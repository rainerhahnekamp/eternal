import { mergeExpects } from '@playwright/test';
import { toLookLikeAButtonExpect } from './to-look-like-a-button';

const mergedExpect = mergeExpects(toLookLikeAButtonExpect);
export const expect = mergedExpect.configure({ soft: true });
