import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ReadBillsByUserId, DeleteBillByDocId } from 'src/app/store/bill/actions';
import { State } from 'src/app/store/bill/reducer';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
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

  onClickRemoveBill(billId: CollectionBill['documentId']) {
    this.store.dispatch(DeleteBillByDocId({ docId: billId }));
  }

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.store.dispatch(ReadBillsByUserId({ userId: user && user.uid }));
    });
  }

}
