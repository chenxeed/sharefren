import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Bill } from 'src/app/type/bill';
import { CollectionName, CollectionBill } from 'src/app/type/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  key = 'shareFrenBills';

  constructor(private firestore: AngularFirestore) {
  }

  readByUserId(userId: Bill['userId']): Observable<CollectionBill[]> {
    return this.firestore
      .collection<Bill>(CollectionName.Bills, ref => ref.where('userId', '==', userId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          const bills = actions.map(action => ({
            doc: action.payload.doc.data(),
            documentId: action.payload.doc.id
          }))
          return bills
        })
      );
  }

  readByDocId(documentId: CollectionBill['documentId']): Observable<CollectionBill> {
    return this.firestore
      .collection<Bill>(CollectionName.Bills)
      .doc<Bill>(documentId)
      .snapshotChanges()
      .pipe(
        map(action => {
          return {
            doc: action.payload.data(),
            documentId: action.payload.id
          }
        })
      );
  }

  create(newBill: Bill) {
    return new Promise<DocumentReference>((resolve, reject) =>{
        this.firestore
          .collection<Bill>(CollectionName.Bills)
          .add(newBill)
          .then(res => resolve(res), err => reject(err));
    });
  }

  update(documentId: CollectionBill['documentId'], updatedBill: Bill) {

    // return this.firestore
    //   .collection<Bill>(CollectionName.Bills)
    //   .doc(documentId)


    // const storedBills = this.getBills();
    // const updatedBills = storedBills.map(bill => {
    //   if (updatedBill.id === bill.id) {
    //     return updatedBill;
    //   } else {
    //     return bill;
    //   }
    // });
    // localStorage.setItem(this.key, JSON.stringify(updatedBills));
    // return Promise.resolve();
  }

  delete(billId: CollectionBill['documentId']) {
    // const storedBills = this.getBills();
    // const removedIndex = storedBills.findIndex(bill => bill.id === billId);
    // storedBills.splice(removedIndex, 1);
    // localStorage.setItem(this.key, JSON.stringify(storedBills));
    // return Promise.resolve();
  }
}
