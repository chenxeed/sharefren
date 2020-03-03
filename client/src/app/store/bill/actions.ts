import { createAction, props } from '@ngrx/store'
import { Bill } from 'src/app/bill'

export enum ActionTypes {
  Load = 'LOAD_BILLS',
  Init = 'INIT_BILLS',
  Add = 'ADD_BILL',
  Remove = 'REMOVE_BILL'
}

export const LoadBills = createAction(
  ActionTypes.Load
)

export const InitBills = createAction(
  ActionTypes.Init,
  props<{ payload: Bill[] }>()
)

export const AddBill = createAction(
  ActionTypes.Add,
  props<{ payload: Bill }>()
)

export const RemoveBill = createAction(
  ActionTypes.Remove,
  props<{ payload: Bill['id'] }>()
)
