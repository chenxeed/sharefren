import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectBills } from 'src/app/store/bill/reducer';
import { RemoveBill } from 'src/app/store/bill/actions';
import { Observable, from } from 'rxjs';
import { Bill } from '../bill';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  bills$: Observable<Bill[]>

  constructor(store: Store<{ bills: [] }>) {
    this.bills$ = store.pipe(select('bills'))
  }

  ngOnInit() {
  }

}
