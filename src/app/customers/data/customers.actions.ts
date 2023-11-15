import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Customer } from '@app/customers/model';

export const customersActions = createActionGroup({
  source: 'Customers',
  events: {
    Init: emptyProps(),
    Get: props<{ page: number }>(),
    Load: props<{ page: number }>(),
    Loaded: props<{ customers: Customer[]; total: number; page: number }>(),
    Add: props<{ customer: Customer }>(),
    Added: props<{ customers: Customer[] }>(),
    Update: props<{ customer: Customer }>(),
    Updated: props<{ customers: Customer[] }>(),
    Remove: props<{ customer: Customer }>(),
    Removed: props<{ customers: Customer[] }>(),
    Select: props<{ id: number }>(),
    Unselect: emptyProps(),
  },
});
