import { createAction, props } from '@ngrx/store';
import { Bill } from 'src/app/type/bill';
import { CollectionBill } from 'src/app/type/firestore';
import { Action } from 'rxjs/internal/scheduler/Action';

export enum ActionTypes {
  ReadByUserId = 'READ_BILLS_BY_USER_ID',
  ReadByDocId = 'READ_BILL_BY_DOC_ID',
  Create = 'CREATE_BILL',
  UpdateByDocId = 'UPDATE_BILL_BY_DOC_ID',
  DeleteyDocId = 'DELETE_BILL_BY_DOC_ID',
  Mutate = 'MUTATE_BILLS'
}

export const ReadBillsByUserId = createAction(
  ActionTypes.ReadByUserId,
  props<{ userId: Bill['userId'] }>()
);

export const ReadBillByDocId = createAction(
  ActionTypes.ReadByDocId,
  props<{ docId: CollectionBill['documentId'] }>()
);

export const CreateBill = createAction(
  ActionTypes.Create,
  props<{ bill: Bill }>()
);

export const DeleteBillByDocId = createAction(
  ActionTypes.DeleteyDocId,
  props<{ docId: CollectionBill['documentId'] }>()
);

export const MutateBills = createAction(
  ActionTypes.Mutate,
  props<{ payload: CollectionBill[] }>()
)

export const UpdateBillByDocId = createAction(
  ActionTypes.UpdateByDocId,
  props<{
    id: CollectionBill['documentId'],
    bill: Pick<Bill, 'name'|'items'|'friends'|'payers'|'debts'|'updated'>
  }>()
);
