import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from './security.reducer';

export const securityActions = createActionGroup({
  source: 'Security',
  events: {
    loaded: props<{ user: User }>(),
    'sign in': emptyProps(),
    'sign in success': props<{ user: User }>(),
    'sign out': emptyProps(),
    'sign out success': props<{ user: User }>()
  }
});
