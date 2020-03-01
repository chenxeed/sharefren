import { createAction, props } from '@ngrx/store'
import { Bill } from 'src/app/bill'

export enum ActionTypes {
  Add = 'ADD_BILL',
  Remove = 'REMOVE_BILL'
}

export const AddBill = createAction(
  ActionTypes.Add,
  props<{ payload: Bill }>()
)

export const RemoveBill = createAction(
  ActionTypes.Remove,
  props<{ payload: Bill['id'] }>()
)
