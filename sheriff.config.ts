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
        '<domain>/api': ['domain:<domain>:api', 'type:api'],
        '<domain>/feat-<name>': ['domain:<domain>', 'type:feature'],
        '<domain>/<type>': ['domain:<domain>', 'type:<type>'],
      },
    },
  },
  depRules: {
    root: [...['type:api', 'type:feature'], 'shared'],
    'domain:*': [
      sameTag, // domain:bookings -> domain:bookings
      'shared',
      ({ from, to }) => from.startsWith(to), // domain:bookings:api -> domain:bookings
    ],
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
    'type:data': ['type:model', 'shared:config', 'shared:ui-messaging'],
    'type:ui': ['type:model', 'shared:form', 'shared:ui'],
    'type:model': noDependencies,
    shared: 'shared',
    'shared:http': ['shared:config', 'shared:ui-messaging'],
    'shared:ngrx-utils': 'shared:util',
    'shared:security': 'shared:http',
    'shared:ui-messaging': noDependencies,
    ...api('bookings', 'customers'),
  },
};
