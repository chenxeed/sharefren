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
  price: number,
  sharer_ids: Friend['id'][]
}

interface Payer {
  id: string,
  payerId: Friend['id'],
  payment: number
}

interface Debt {
  owerId: Friend['id'],
  amount: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // States
  friends: Friend[] = [];
  friendById: Record<Friend['id'], Friend> = {};
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
  debts: Debt[] = [];

  // UI State
  editItemSharerId: Item['id'] = ''

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

    // Observe for state values
    this.friends$.subscribe(friends => {
      this.friends = friends
      this.friendById = {}
      friends.forEach(friend => {
        this.friendById[friend.id] = friend
      })
    })
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
      updateDebts()
    }

    const updateDebts = () => {
      this.debts = []
      if (this.isPaymentCompleted) {
        this.friends.forEach(friend => {

          const sharedItems = this.items.filter(item => item.sharer_ids.includes(friend.id))
          const sum = sharedItems.reduce((total, item) => {
            const price = item.price
            const sharerCount = item.sharer_ids.length
            const sharedPrice = price / sharerCount
            return total + sharedPrice
          }, 0)

          const paid = this.payers.filter(payer => payer.payerId === friend.id).reduce((total, payer) => total + payer.payment, 0)
          const amount = sum - paid

          if (amount != 0) {
            this.debts.push({
              owerId: friend.id,
              amount
            })  
          }
        })
      }
    }
  }

  getFriendName(friend_ids) {
    return friend_ids.map(id => this.friendById[id].name).join(', ')
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
      price: parseFloat(itemData.price),
      sharer_ids: Object.keys(this.friendById)
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

  onEditItemSharer(itemId) {
    this.editItemSharerId = itemId
  }

  onSubmitItemSharer(event: Event) {
    event.preventDefault()
    const item = this.items.find(item => item.id === this.editItemSharerId)
    const target = event.target as HTMLFormElement
    const values = Array.from(target.elements)
      .filter((elm: HTMLInputElement) => elm.checked)
      .map((elm: HTMLInputElement) => elm.value)
    
    item.sharer_ids = values

    this.items$.next(this.items)

    this.editItemSharerId = ""
  }

  ngOnInit() {

  }

}
