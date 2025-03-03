import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Expense } from '../model/expense';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private afs: AngularFirestore) {}

  addExpense(expense: Expense) {
    expense.id = this.afs.createId();
    return this.afs.collection('/Expenses').add(expense);
  }

  getAllExpense() {
    return this.afs.collection('/Expenses').snapshotChanges();
  }

  deleteExpense(expense: Expense) {
    return this.afs.doc('/Expenses/' + expense.id).delete();
  }

  updateExpense(expense: Expense) {
    this.deleteExpense(expense);
    this.addExpense(expense);
  }
}
