import { noDependencies, sameTag, SheriffConfig } from '@softarc/sheriff-core';

const api = (from: string, to: string) => ({
  [`domain:${from}`]: `domain:${to}:api`,
});

export const sheriffConfig: SheriffConfig = {
  entryFile: 'src/main.ts',
  enableBarrelLess: true,
  modules: {
    'src/app': {
      'shared/<shared>': ['shared', 'shared:<shared>'],
      domains: {
        diary: ['domain:diary', 'type:feature'],
        bookings: ['domain:bookings', 'type:feature'],
        '<domain>/api': ['domain:<domain>:api', 'sub-domain:api', 'type:api'],
        '<domain>/feat-<feature>': [
          'domain:<domain>',
          'sub-domain:none',
          'type:feature',
        ],
        '<domain>/sub-<name>': [
          'domain:<domain>',
          'sub-domain:<name>',
          'type:feature',
        ],
        '<domain>/sub-<sub>/data': [
          'domain:<domain>',
          'sub-domain:<sub>',
          'type:data',
        ],
        '<domain>/sub-<sub>/model': [
          'domain:<domain>',
          'sub-domain:<sub>',
          'type:model',
        ],
        '<domain>/sub-<sub>/ui': [
          'domain:<domain>',
          'sub-domain:<sub>',
          'type:ui',
        ],
        '<domain>/<type>': [
          'domain:<domain>',
          'type:<type>',
          'sub-domain:none',
        ],
      },
    },
  },
  depRules: {
    root: [...['type:api', 'type:feature'], 'shared'],
    'domain:*': [
      sameTag, // domain:bookings -> domain:bookings
      'shared',
      ({ from, to }) => from.endsWith(':api') && from.startsWith(to), // domain:bookings:api -> domain:bookings
    ],
    'sub-domain:api': ({ to }) => to.startsWith('sub-domain'),
    'sub-domain:*': [sameTag, 'shared'],
    'type:api': [({ to }) => to.startsWith('type'), 'shared:config'],
    'type:feature': [
      ...['type:api', 'type:data', 'type:ui', 'type:model'],
      'shared:config',
      'shared:form',
      'shared:master-data',
      'shared:testing',
      'shared:ui-messaging',
      'shared:util',
    ],
    'type:data': [
      'type:model',
      'shared:config',
      'shared:ui-messaging',
      'shared:util',
    ],
    'type:ui': ['type:model', 'shared:form', 'shared:ui', 'shared:util'],
    'type:model': noDependencies,
    shared: 'shared',
    'shared:http': ['shared:config', 'shared:ui-messaging'],
    'shared:ngrx-utils': 'shared:util',
    'shared:security': 'shared:http',
    'shared:ui-messaging': 'shared:http',
    ...api('bookings', 'customers'),
  },
};
