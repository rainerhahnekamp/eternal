import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Customer } from '../../model/customer';

export const customersActions = createActionGroup({
  source: 'Customers',
  events: {
    Load: props<{ page: number; callback?: () => void }>(),
    Loaded: props<{ customers: Customer[]; total: number; page: number }>(),
    Add: props<{ customer: Customer }>(),
    Added: props<{ customers: Customer[] }>(),
    Update: props<{ customer: Customer }>(),
    Updated: props<{ customers: Customer[] }>(),
    Remove: props<{ id: number }>(),
    Removed: props<{ customers: Customer[] }>(),
    Select: props<{ id: number }>(),
    Unselect: emptyProps(),
  },
});
