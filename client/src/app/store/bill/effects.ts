import { Injectable } from '@angular/core';
import { MutateBills, ReadBillsByUserId, CreateBill, ReadBillByDocId, UpdateBillByDocId, DeleteBillByDocId } from './actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map, mergeMap } from 'rxjs/operators';
import { BillService } from 'src/app/service/bill/bill.service';


@Injectable()
export class BillEffects {

  constructor(private actions$: Actions, private billService: BillService) {}

  readBillsByUserId$ = createEffect(() => this.actions$.pipe(
    ofType(ReadBillsByUserId),
    mergeMap(payload => this.billService.readByUserId(payload.userId).pipe(
        map(bills => {
          return MutateBills({ payload: bills })
        })
      )
    )
  ));

  readBillByDocId$ = createEffect(() => this.actions$.pipe(
    ofType(ReadBillByDocId),
    mergeMap(payload => this.billService.readByDocId(payload.docId).pipe(
        map(bill => {
          return MutateBills({ payload: [bill] })
        })
      )
    )
  ));

  createBill$ = createEffect(() => this.actions$.pipe(
    ofType(CreateBill),
    tap(payload => this.billService.create(payload.bill))
  ), { dispatch: false });

  updateBill$ = createEffect(() => this.actions$.pipe(
    ofType(UpdateBillByDocId),
    tap(payload => this.billService.updateByDocId(payload.id, payload.bill))
  ), { dispatch: false });

  deleteBill$ = createEffect(() => this.actions$.pipe(
    ofType(DeleteBillByDocId),
    tap(payload => this.billService.deleteByDocId(payload.docId))
  ), { dispatch: false });
}
