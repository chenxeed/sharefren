import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LoadBills, RemoveBill } from 'src/app/store/bill/actions';
import { Observable } from 'rxjs';
import { Bill } from '../type/bill';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  bills$: Observable<Bill[]>;

  constructor(private store: Store<{ bills: [] }>) {
    this.bills$ = store.pipe(select('bills'));

    store.dispatch(LoadBills());
  }

  onClickRemoveBill(billId: Bill['id']) {
    this.store.dispatch(RemoveBill({ payload: billId }));
  }

  ngOnInit() {
  }

}
