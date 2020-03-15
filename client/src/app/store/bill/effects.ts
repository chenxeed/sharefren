import { Injectable } from '@angular/core';
import { ActionTypes, ReadBills } from './actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map, mergeMap } from 'rxjs/operators';
import { BillService } from 'src/app/service/bill.service';
import { Bill } from 'src/app/type/bill';


@Injectable()
export class BillEffects {

  constructor(private actions$: Actions, private billService: BillService) {}

  readBill$ = createEffect(() => this.actions$.pipe(
    ofType(ActionTypes.Load),
    mergeMap(() => this.billService.read().pipe(
        map(actions => {
          const bills = actions.map(action => action.payload.doc.data())
          return ReadBills({ payload: bills })
        })
      )
    )
  ));

  createBill$ = createEffect(() => this.actions$.pipe(
    ofType(ActionTypes.Add),
    map((action: any) => action.payload),
    tap(payload => this.billService.create(payload))
  ), { dispatch: false });

  updateBill$ = createEffect(() => this.actions$.pipe(
    ofType(ActionTypes.Update),
    map((action: any) => action.payload),
    tap(payload => this.billService.update(payload))
  ), { dispatch: false });

  removeBill$ = createEffect(() => this.actions$.pipe(
    ofType(ActionTypes.Remove),
    map((action: any) => action.payload),
    tap(payload => this.billService.remove(payload))
  ), { dispatch: false });
}
