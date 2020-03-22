import { Injectable } from '@angular/core';
import { ActionTypes, MutateBills, ReadBillsByUserId, CreateBill, ReadBillByDocId } from './actions';
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

  // updateBill$ = createEffect(() => this.actions$.pipe(
  //   ofType(ActionTypes.Update),
  //   map((action: any) => action.payload),
  //   tap(payload => this.billService.update(payload))
  // ), { dispatch: false });

  // removeBill$ = createEffect(() => this.actions$.pipe(
  //   ofType(ActionTypes.Remove),
  //   map((action: any) => action.payload),
  //   tap(payload => this.billService.remove(payload))
  // ), { dispatch: false });
}
