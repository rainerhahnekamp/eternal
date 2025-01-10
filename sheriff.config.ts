import { SheriffConfig } from '@softarc/sheriff-core';

/**
 * Minimal configuration for Sheriff
 * Assigns the 'noTag' tag to all modules and
 * allows all modules to depend on each other.
 */

export const config: SheriffConfig = {
  modules: {
    'src/app/<domain>': {
      feature: ['type:feature'],
      ui: ['type:ui'],
      data: ['type:data'],
      model: ['type:model'],
    },
  },
  enableBarrelLess: true,
  depRules: {
    root: ['noTag', 'type:feature'],
    noTag: 'noTag',

    'type:feature': ['type:*'],
    'type:ui': 'type:model',
    'type:data': 'type:model',
    'type:model': [],
  },
};
