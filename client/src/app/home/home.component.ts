import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthService } from 'angularx-social-login';
import { ReadBillsByUserId } from 'src/app/store/bill/actions';
import { State } from 'src/app/store/bill/reducer';
import { Observable } from 'rxjs';
import { CollectionBill } from '../type/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  bills$: Observable<State>;

  constructor(private store: Store<{ bills: [] }>, private authService: AuthService) {
    this.bills$ = store.pipe(select('bills'));
  }

  // onClickRemoveBill(billId: Bill['id']) {
  //   this.store.dispatch(ReadBillsByUserId({ payload: billId }));
  // }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.store.dispatch(ReadBillsByUserId({ userId: user && user.id }));
    });
  }

}
