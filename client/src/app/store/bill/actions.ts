import { createAction, props } from '@ngrx/store';
import { Bill } from 'src/app/type/bill';

export enum ActionTypes {
  Load = 'LOAD_BILLS',
  Init = 'INIT_BILLS',
  Add = 'ADD_BILL',
  Update = 'UPDATE_BILL',
  Remove = 'REMOVE_BILL'
}

export const LoadBills = createAction(
  ActionTypes.Load
);

export const InitBills = createAction(
  ActionTypes.Init,
  props<{ payload: Bill[] }>()
);

export const AddBill = createAction(
  ActionTypes.Add,
  props<{ payload: Bill }>()
);

export const UpdateBill = createAction(
  ActionTypes.Update,
  props<{ payload: Omit<Bill, 'created'|'userId'> }>()
);

export const RemoveBill = createAction(
  ActionTypes.Remove,
  props<{ payload: Bill['id'] }>()
);
