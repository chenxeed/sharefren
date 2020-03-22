import { Component, OnInit } from '@angular/core';
import { select, Store, State } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as uuid from 'uuid';
import { Subject, Observable } from 'rxjs';
import { ReadBillByDocId } from 'src/app/store/bill/actions';
import { State as BillState } from 'src/app/store/bill/reducer';
import { Friend, Item, Payer, Debt } from 'src/app/type/bill';
import { SocialUser, AuthService } from 'angularx-social-login';
import { CollectionBill } from '../type/firestore';

const enum Steps {
  FRIEND = 'friend',
  ITEM = 'item',
  PAYER = 'payer',
  DEBT = 'debt'
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  // States
  billId: CollectionBill['documentId'] = '';
  bills$: Observable<BillState>;
  friends: Friend[] = [];
  friendById: Record<Friend['id'], Friend> = {};
  items: Item[] = [];
  payers: Payer[] = [];
  user?: SocialUser;

  // Observables
  friends$ = new Subject<Friend[]>();
  items$ = new Subject<Item[]>();
  payers$ = new Subject<Payer[]>();

  // Computed
  totalPrice = 0;
  totalPaid = 0;
  paymentLeft = 0;
  isPaymentCompleted = false;
  debts: Debt[] = [];

  // UI State
  steps: Steps = Steps.DEBT;
  editItemSharerId: Item['id'] = '';

  // FormGroup
  friendForm: FormGroup;
  itemForm: FormGroup;
  payerForm: FormGroup;
  billForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<{ bills: BillState }>,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.bills$ = store.pipe(select('bills'));

    this.friendForm = this.formBuilder.group({
      name: new FormControl('', Validators.required)
    });

    this.itemForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required)
    });

    this.payerForm = this.formBuilder.group({
      payer: new FormControl('', Validators.required),
      payment: new FormControl('', Validators.required)
    });

    this.billForm = this.formBuilder.group({
      name: new FormControl('', Validators.required)
    });

    // Observe for state values
    this.friends$.subscribe(friends => {
      this.friends = friends;
      this.friendById = {};
      friends.forEach(friend => {
        this.friendById[friend.id] = friend;
      });
    });
    this.items$.subscribe(items => { this.items = items; });
    this.payers$.subscribe(payers => { this.payers = payers; });

    // Observe for computed values
    this.items$.subscribe(items => {
      this.totalPrice = items.reduce<number>((total, item) => {
        return total + item.price;
      }, 0);
      updatePaymentLeft();
    });

    this.payers$.subscribe(payers => {
      this.totalPaid = payers.reduce((total, payer) => {
        return total + payer.payment;
      }, 0);
      updatePaymentLeft();
    });

    const updatePaymentLeft = () => {
      const paymentLeft = this.totalPrice - this.totalPaid;
      this.paymentLeft = paymentLeft
      this.payerForm.setValue({ payer: '', payment: paymentLeft })
      checkIsPaymentCompleted();
    };

    const checkIsPaymentCompleted = () => {
      this.isPaymentCompleted = this.totalPrice <= 0 ? false : this.paymentLeft <= 0;
      updateDebts();
    };

    const updateDebts = () => {
      this.debts = [];
      if (this.isPaymentCompleted) {
        this.friends.forEach(friend => {

          const sharedItems = this.items.filter(item => item.sharer_ids.includes(friend.id));
          const sum = sharedItems.reduce((total, item) => {
            const price = item.price;
            const sharerCount = item.sharer_ids.length;
            const sharedPrice = price / sharerCount;
            return total + sharedPrice;
          }, 0);

          const paid = this.payers.filter(payer => payer.payerId === friend.id).reduce((total, payer) => total + payer.payment, 0);
          const amount = sum - paid;

          if (amount != 0) {
            this.debts.push({
              owerId: friend.id,
              amount,
              settled: false
            });
          }
        });
      }
    };
  }

  getFriendName(friend_ids) {
    return friend_ids.map(id => this.friendById[id].name).join(', ');
  }

  onSubmitFriendForm(friendData: { name: string }) {
    const name = friendData.name.trim()
    if (!name) {
      return
    }

    const friendsInput = name.split(',').filter(name => name.trim());

    const friends: Friend[] = friendsInput.map(name => ({
      id: uuid(),
      name: name.trim()
    }));
    this.friends$.next([
      ...this.friends,
      ...friends
    ]);
    this.friendForm.reset();
  }

  onSubmitItemForm(itemData: { name: string, price: string }) {
    const name = itemData.name.trim();
    const price = parseFloat(itemData.price);

    if (!name || !price || price < 0) {
      return
    }

    const item = {
      id: uuid(),
      name,
      price,
      sharer_ids: Object.keys(this.friendById)
    };
    this.items$.next([
      ...this.items,
      item
    ]);
    this.itemForm.reset();
  }

  onSubmitPayerForm(payerData) {
    const payer = {
      id: uuid(),
      payerId: payerData.payer,
      payment: parseFloat(payerData.payment)
    };
    this.payers$.next([
      ...this.payers,
      payer
    ]);
    this.payerForm.reset();
  }

  onEditItemSharer(itemId) {
    this.editItemSharerId = itemId;
  }

  onSubmitItemSharer(event: Event) {
    event.preventDefault();
    const item = this.items.find(item => item.id === this.editItemSharerId);
    const target = event.target as HTMLFormElement;
    const values = Array.from(target.elements)
      .filter((elm: HTMLInputElement) => elm.checked)
      .map((elm: HTMLInputElement) => elm.value);

    item.sharer_ids = values;

    this.items$.next(this.items);

    this.editItemSharerId = '';
  }

  onSubmitBillForm(billData) {
    const billName = billData.name.trim()
    if (!billName) {
      return
    }

    const currentTime = new Date()
    const timestamp = currentTime.getTime()
    // if (this.billId) {
    //   // update existing bill
    //   this.store.dispatch(UpdateBill({
    //     payload: {
    //       id: this.billId,
    //       name: billName,
    //       friends: this.friends,
    //       items: this.items,
    //       payers: this.payers,
    //       debts: this.debts,
    //       updated: timestamp
    //     }
    //   }));

    // } else {
    //   // create new
    //   const userId = this.user && this.user.id
    //   this.store.dispatch(AddBill({
    //     payload: {
    //       id: uuid(),
    //       name: billName,
    //       friends: this.friends,
    //       items: this.items,
    //       payers: this.payers,
    //       debts: this.debts,
    //       userId: userId || '',
    //       created: timestamp,
    //       updated: timestamp
    //     }
    //   }));
    // }
    this.router.navigate(['/']);
  }

  ngOnInit() {
    // Get the router
    const billId = this.route.snapshot.params.billId;

    // Get the user
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.store.dispatch(ReadBillByDocId({ docId: billId }));
    });

    this.bills$.subscribe(bills => {
      if (bills.length === 1) {
        const bill = bills[0];
        if (bill.documentId === billId) {
          const billDoc = bill.doc
          this.friends$.next(billDoc.friends);
          this.items$.next(billDoc.items);
          this.payers$.next(billDoc.payers);
          this.debts = billDoc.debts;
          this.billForm.setValue({ name: billDoc.name })  
        }
      }
    });
  }

}
