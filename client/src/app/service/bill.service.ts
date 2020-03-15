import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Bill } from '../type/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  key = 'shareFrenBills';

  constructor(private firestore: AngularFirestore) {
    this.getBills();
  }

  load() {
    return Promise.resolve(this.getBills());
  }

  create(newBill: Bill) {

    const storedBills = this.getBills();
    storedBills.push(newBill);
    localStorage.setItem(this.key, JSON.stringify(storedBills));
    return Promise.resolve();
  }

  update(updatedBill: Bill) {
    const storedBills = this.getBills();
    const updatedBills = storedBills.map(bill => {
      if (updatedBill.id === bill.id) {
        return updatedBill;
      } else {
        return bill;
      }
    });
    localStorage.setItem(this.key, JSON.stringify(updatedBills));
    return Promise.resolve();
  }

  remove(billId: Bill['id']) {
    const storedBills = this.getBills();
    const removedIndex = storedBills.findIndex(bill => bill.id === billId);
    storedBills.splice(removedIndex, 1);
    localStorage.setItem(this.key, JSON.stringify(storedBills));
    return Promise.resolve();
  }

  private getBills() {
    const storedBills = localStorage.getItem(this.key);
    if (!storedBills) {
      const newBills: Bill[] = [];
      localStorage.setItem(this.key, JSON.stringify(newBills));
      return newBills;
    } else {
      return JSON.parse(storedBills) as Bill[];
    }
  }
}
