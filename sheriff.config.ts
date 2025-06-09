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
        '<domain>/ui': ['domain:<domain>:ui', 'type:ui'],
        '<domain>/data': ['domain:<domain>:data', 'type:data'],
        '<domain>/model': ['domain:<domain>:model', 'type:model'],

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
      ({ from, to }) => {
        const toTags = to.split(':');
        const isToSharedDomain =
          toTags.length > 2 && ['data', 'ui', 'model'].includes(toTags[2]);

        const fromTags = from.split(':');
        const isFromFeature =
          fromTags.length > 2 && !['data', 'ui', 'model'].includes(fromTags[2]);

        const isSameDomain = toTags[1] === fromTags[1];

        return isSameDomain && isFromFeature && isToSharedDomain;
      }, // domain:holidays:feat-overview -> domain:holidays:data
      ({ from, to }) => {
        const toTags = to.split(':');
        const fromTags = from.split(':');

        const isToSharedDomain = ['data', 'ui', 'model'].includes(toTags[2]);
        const isFromSharedDomain = ['data', 'ui', 'model'].includes(
          fromTags[2],
        );

        const isSameDomain = toTags[1] === fromTags[1];

        return isSameDomain && isFromSharedDomain && isToSharedDomain;
      }, // domain:holidays:feature -> domain:holidays:data
    ],
    'type:api': [({ to }) => to.startsWith('type')],
    'type:feature': ({ to }) => to.startsWith('type:'),
    'type:data': ['type:model'],
    'type:ui': ['type:model'],
    'type:model': noDependencies,
    ...api('bookings', 'customers'),
  },
};
