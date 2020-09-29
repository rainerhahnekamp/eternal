import 'jest-preset-angular';
import 'jest-image-snapshot';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });
