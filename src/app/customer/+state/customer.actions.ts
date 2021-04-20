import { createAction, props } from '@ngrx/store';
import { Customer } from '../customer';

const load = createAction('[Customer] Load');
const loaded = createAction(
  '[Customer] Loaded',
  props<{ customers: Customer[]; pageCount: number }>()
);

const add = createAction('[Customer] Add', props<{ customer: Customer }>());
const added = createAction('[Customer] Added', props<{ customer: Customer }>());

const update = createAction('[Customer] Update', props<{ customer: Customer }>());
const updated = createAction('[Customer] Updated', props<{ customer: Customer }>());

const remove = createAction('[Customer] Remove', props<{ customer: Customer }>());
const removed = createAction('[Customer] Removed', props<{ customer: Customer }>());

const nextPage = createAction('[Customer] Next Page');
const nextPageSuccess = createAction(
  '[Customer] Next Page Success',
  props<{ customers: Customer[] }>()
);

const previousPage = createAction('[Customer] Previous Page');
const previousPageSuccess = createAction(
  '[Customer] Previous Page Success',
  props<{ customers: Customer[] }>()
);

export const CustomerActions = {
  load,
  loaded,
  add,
  added,
  update,
  updated,
  remove,
  removed,
  nextPage,
  nextPageSuccess,
  previousPage,
  previousPageSuccess
};
