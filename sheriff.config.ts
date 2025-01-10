import { sameTag, SheriffConfig } from "@softarc/sheriff-core";

/**
 * Minimal configuration for Sheriff
 * Assigns the 'noTag' tag to all modules and
 * allows all modules to depend on each other.
 */

export const config: SheriffConfig = {
  modules: {
    'src/app/shared': 'shared',
    'src/app/<domain>': {
      api: ['domain:<domain>:api', 'type:api'],
      feature: ['domain:<domain>', 'type:feature'],
      ui: ['domain:<domain>', 'type:ui'],
      data: ['domain:<domain>', 'type:data'],
      model: ['domain:<domain>', 'type:model'],
    },
  },
  enableBarrelLess: true,
  depRules: {
    root: ['noTag', 'type:feature'],
    noTag: 'noTag',

    'domain:*': [sameTag, 'shared'],
    'domain:quiz': 'domain:booking:api',

    'type:feature': ['type:*', 'shared'],
    'type:ui': 'type:model',
    'type:data': 'type:model',
    'type:model': [],
  },
};
