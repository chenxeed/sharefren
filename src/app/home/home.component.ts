import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as uuid from 'uuid';
import { Subject } from 'rxjs';

interface Friend {
  id: string,
  name: string
}

interface Item {
  id: string,
  name: string,
  price: number
}

interface Payer {
  id: string,
  payerId: Friend['id'],
  payment: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // States
  friends: Friend[] = [];
  items: Item[] = [];
  payers: Payer[] = [];

  // Observables
  friends$ = new Subject<Friend[]>();
  items$ = new Subject<Item[]>();
  payers$ = new Subject<Payer[]>();

  // Computed
  totalPrice = 0;
  totalPaid = 0;
  paymentLeft = 0;
  isPaymentCompleted = false;

  // FormGroup
  friendForm: FormGroup;
  itemForm: FormGroup;
  payerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.friendForm = this.formBuilder.group({
      name: new FormControl('', Validators.required)
    })

    this.itemForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required)
    })

    this.payerForm = this.formBuilder.group({
      payer: new FormControl('', Validators.required),
      payment: new FormControl('', Validators.required)
    })

    // Subscribe
    this.friends$.subscribe(friends => { this.friends = friends })
    this.items$.subscribe(items => { this.items = items })
    this.payers$.subscribe(payers => { this.payers = payers })

    // Observe for computed values
    this.items$.subscribe(items => {
      this.totalPrice = items.reduce<number>((total, item) => {
        return total + item.price
      }, 0)
      updatePaymentLeft()
    })

    this.payers$.subscribe(payers => {
      this.totalPaid = payers.reduce((total, payer) => {
        return total + payer.payment
      }, 0)
      updatePaymentLeft()
    })

    const updatePaymentLeft = () => {
      this.paymentLeft = this.totalPrice - this.totalPaid
      checkIsPaymentCompleted()
    }

    const checkIsPaymentCompleted = () => {
      this.isPaymentCompleted = this.totalPrice <= 0 ? false : this.paymentLeft <= 0
    }
  }

  onSubmitFriendForm(friendData) {
    const friend = {
      id: uuid(),
      name: friendData.name
    }
    this.friends$.next([
      ...this.friends,
      friend
    ])
    this.friendForm.reset()
  }

  onSubmitItemForm(itemData) {
    const item = {
      id: uuid(),
      name: itemData.name,
      price: parseFloat(itemData.price)
    }
    this.items$.next([
      ...this.items,
      item
    ])
    this.itemForm.reset()
  }

  onSubmitPayerForm(payerData) {
    const payer = {
      id: uuid(),
      payerId: payerData.payer,
      payment: parseFloat(payerData.payment)
    }
    this.payers$.next([
      ...this.payers,
      payer
    ])
    this.payerForm.reset()
  }

  ngOnInit() {

  }

}
