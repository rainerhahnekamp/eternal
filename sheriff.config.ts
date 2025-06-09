import { noDependencies, sameTag, SheriffConfig } from '@softarc/sheriff-core';

const api = (from: string, to: string) => ({
  [`domain:${from}`]: `domain:${to}:api`,
});

export const sheriffConfig: SheriffConfig = {
  entryFile: 'src/main.ts',
  enableBarrelLess: true,
  modules: {
    'src/app': {
      'shared/<shared>': ['shared'],

      domains: {
        '<domain>': ['domain:<domain>', 'type:feature'],
        '<domain>/api': ['domain:<domain>:api', 'type:api'],
        '<domain>/ui': ['domain:<domain>', 'type:ui'],
        '<domain>/data': ['domain:<domain>', 'type:data'],
        '<domain>/model': ['domain:<domain>', 'type:model'],

        '<domain>/feat-<feat>': ['domain:<domain>:<feat>', 'type:feature'],
        '<domain>/feat-<feat>/api': ['domain:<domain>:<feat>', 'type:api'],
        '<domain>/feat-<feat>/data': ['domain:<domain>:<feat>', 'type:data'],
        '<domain>/feat-<feat>/ui': ['domain:<domain>:<feat>', 'type:ui'],
        '<domain>/feat-<feat>/model': ['domain:<domain>:<feat>', 'type:model'],
      },
    },
    'ngrx-signals': ['shared'],
    ...Object.fromEntries(
      ['', '/entities', '/events', '/rxjs-interop', '/testing'].map(
        (ngrxModule) => [`ngrx-signals${ngrxModule}`, 'shared'],
      ),
    ),
  },
  depRules: {
    root: ['type:api', 'type:feature'],
    '*': 'shared',
    'domain:*': [
      sameTag, // domain:bookings -> domain:bookings
      ({ from, to }) => to.startsWith(from), // domain:bookings -> domain:bookings:feature,
      ({ from, to }) =>
        from.endsWith(':api') && to.startsWith(from.slice(0, -4)), // domain:customers:api -> domain:customers:*
    ],
    'type:api': [({ to }) => to.startsWith('type')],
    'type:feature': ({ to }) => to.startsWith('type:'),
    'type:data': ['type:model'],
    'type:ui': ['type:model'],
    'type:model': noDependencies,
    ...api('bookings', 'customers'),
  },
};
