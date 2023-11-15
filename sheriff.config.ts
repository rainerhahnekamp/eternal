import { noDependencies, sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const sheriffConfig: SheriffConfig = {
  tagging: {
    'src/app': {
      bookings: ['domain:bookings', 'type:feature'],
      diary: ['domain:diary', 'type:feature'],
      'shared/<shared>': 'shared:<shared>',
      '<domain>/<type>': ['domain:<domain>', 'type:<type>'],
    },
  },
  depRules: {
    root: [
      'type:feature',
      'shared:config',
      'shared:http',
      'shared:master-data',
      'shared:ui-messaging',
      ({ to }) => to.startsWith('domain'),
    ],
    'domain:*': sameTag,
    'type:feature': [
      'type:data',
      'type:ui',
      'type:model',
      'shared:config',
      'shared:form',
      'shared:master-data',
      'shared:ui-messaging',
      'shared:util',
    ],
    'type:data': ['type:model', 'shared:ui-messaging'],
    'type:ui': ['type:model', 'shared:form', 'shared:ui'],
    'type:model': noDependencies,
    'shared:http': ['shared:config', 'shared:ui-messaging'],
    'shared:ngrx-utils': 'shared:util',
  },
};
