import * as actions from './actions'
import { Bill } from 'src/app/bill'
import { InitialState } from '@ngrx/store/src/models'
import { createReducer, on } from '@ngrx/store'

type State = Bill[]

export const initialState: InitialState<State> = []

export const billReducer = createReducer(
  initialState,
  on(actions.InitBills, (_state, { payload }) => {
    return payload
  }),
  on(actions.AddBill, (state, { payload }) => {
    return [
        ...state,
        payload
      ]
  }),
  on(actions.UpdateBill, (state, { payload }) => {
    return [
        ...state.map(bill => {
          if (payload.id === bill.id) {
            return payload
          } else {
            return bill
          }
        })
      ]
  }),
  on(actions.RemoveBill, (state, { payload }) => {
    return state.filter(bill => bill.id !== payload)
  })
)

export const selectBills = (state: State) => state
