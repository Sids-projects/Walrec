import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Expense } from '../model/expense';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private afs: AngularFirestore,
    private fireauth: AngularFireAuth
  ) {}

  // Add Expense - Now each expense will be stored under the user's ID
  addExpense(expense: Expense) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        expense.id = this.afs.createId();
        return this.afs.collection(`/Users/${user.uid}/Expenses`).add(expense);
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  getAllExpense(): Observable<DocumentChangeAction<any>[]> {
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/Expenses`)
            .snapshotChanges();
        } else {
          return of([]); // Return an empty array as an observable when user is not logged in
        }
      })
    );
  }

  // Delete Expense - Delete only from the logged-in user's collection
  deleteExpense(expense: Expense) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .doc(`/Users/${user.uid}/Expenses/${expense.id}`)
          .delete();
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  // Update Expense - Updates the existing document instead of deleting and re-adding
  updateExpense(expense: Expense) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .doc(`/Users/${user.uid}/Expenses/${expense.id}`)
          .update(expense);
      } else {
        throw new Error('User not logged in');
      }
    });
  }
}
