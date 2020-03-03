import { Injectable } from '@angular/core';
import { Bill } from '../bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  key = 'shareFrenBills'

  constructor () {
    this.getBills()
  }

  load () {
    return Promise.resolve(this.getBills())
  }

  save (newBill: Bill) {
    const storedBills = this.getBills()
    storedBills.push(newBill)
    localStorage.setItem(this.key, JSON.stringify(storedBills))
    return Promise.resolve()
  }

  remove (billId: Bill['id']) {
    const storedBills = this.getBills()
    const removedIndex = storedBills.findIndex(bill => bill.id === billId)
    storedBills.splice(removedIndex, 1)
    localStorage.setItem(this.key, JSON.stringify(storedBills))
    return Promise.resolve()
  }

  private getBills () {
    const storedBills = localStorage.getItem(this.key)
    if (!storedBills) {
      const newBills: Bill[] = []
      localStorage.setItem(this.key, JSON.stringify(newBills))
      return newBills
    } else {
      return JSON.parse(storedBills) as Bill[]
    }
  }
}