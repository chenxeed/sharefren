import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Bill } from 'src/app/type/bill';
import { Collection } from 'src/app/type/firestore';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  key = 'shareFrenBills';

  constructor(private firestore: AngularFirestore) {
    this.getBills();
  }

  read() {
    return this.firestore.collection<Bill>(Collection.Bills).snapshotChanges();
  }

  create(newBill: Bill) {
    return new Promise<DocumentReference>((resolve, reject) =>{
        this.firestore
          .collection<Bill>(Collection.Bills)
          .add(newBill)
          .then(res => resolve(res), err => reject(err));
    });
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
