import { Injectable } from '@angular/core';
import { ActionTypes, InitBills } from './actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map, mapTo, mergeMap } from 'rxjs/operators';
import { BillService } from 'src/app/service/bill.service'
import { from } from 'rxjs';
 
 
@Injectable()
export class BillEffects {
 
  constructor(private actions$: Actions, private billService: BillService) {}

  loadBill$ = createEffect(() => this.actions$.pipe(
    ofType(ActionTypes.Load),
    mergeMap(() => from(this.billService.load())
      .pipe(
        map(bills => InitBills({ payload: bills }))
      )
    )
  ))

  addBill$ = createEffect(() => this.actions$.pipe(
    ofType(ActionTypes.Add),
    map((action: any) => action.payload),
    tap(payload => this.billService.save(payload))
  ))

  removeBill$ = createEffect(() => this.actions$.pipe(
    ofType(ActionTypes.Remove),
    map((action: any) => action.payload),
    tap(payload => this.billService.remove(payload))
  ))
}
