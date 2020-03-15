import * as actions from './actions';
import { Bill } from 'src/app/type/bill';
import { InitialState, Action } from '@ngrx/store/src/models';
import { createReducer, on } from '@ngrx/store';

type State = Bill[];

export const initialState: InitialState<State> = [];

const reducer = createReducer(
  initialState,
  on(actions.ReadBills, (_state, { payload }) => {
    return payload;
  }),
  on(actions.AddBill, (state, { payload }) => {
    return [
        ...state,
        payload
      ];
  }),
  on(actions.UpdateBill, (state, { payload }) => {
    return [
        ...state.map(bill => {
          if (payload.id === bill.id) {
            return payload;
          } else {
            return bill;
          }
        })
      ];
  }),
  on(actions.RemoveBill, (state, { payload }) => {
    return state.filter(bill => bill.id !== payload);
  })
);

export function billReducer (state: State | undefined, action: Action) {
  return reducer(state, action)
}

export const selectBills = (state: State) => state;
