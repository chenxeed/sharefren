import * as actions from './actions';
import { InitialState, Action } from '@ngrx/store/src/models';
import { createReducer, on } from '@ngrx/store';
import { CollectionBill } from 'src/app/type/firestore';

export type State = CollectionBill[];

export const initialState: InitialState<State> = [];

const reducer = createReducer(
  initialState,
  on(actions.MutateBills, (_state, { payload }) => {
    return payload;
  })
);

export function billReducer (state: State | undefined, action: Action) {
  return reducer(state, action)
}

export const selectBills = (state: State) => state;
