import { createActionGroup, props } from '@ngrx/store';
import { User } from './security.reducer';

export const securityActions = createActionGroup({
  source: 'Security',
  events: {
    loaded: props<{ user: User }>(),
  },
});
