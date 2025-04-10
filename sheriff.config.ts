import { SheriffConfig } from '@softarc/sheriff-core';

/**
 * Minimal configuration for Sheriff
 * Assigns the 'noTag' tag to all modules and
 * allows all modules to depend on each other.
 */

export const config: SheriffConfig = {
  enableBarrelLess: true,
  modules: {
    'src/app/domains/holidays': {
      overview: 'type:feature',
      'overview/<type>': 'type:<type>',
      quiz: 'type:feature',
      'quiz/<type>': 'type:<type>',
    },
  }, // apply tags to your modules
  depRules: {
    // root is a virtual module, which contains all files not being part
    // of any module, e.g. application shell, main.ts, etc.
    root: ['noTag', 'type:feature'],
    noTag: 'noTag',

    'type:feature': ['type:data', 'type:ui', 'type:model'],
    'type:data': ['type:model', 'root'],
    'type:ui': ['type:model'],
    'type:model': [],
  },
  entryFile: 'src/main.ts',
};
