import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Expense } from '../model/expense';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Profile } from '../model/profile';
import { Payment } from '../model/payment';
import { Income } from '../model/income';
import { IncomeMode } from '../model/income-mode';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private afs: AngularFirestore,
    private fireauth: AngularFireAuth
  ) {}

  // Expense
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
          return of([]);
        }
      })
    );
  }

  deleteExpense(expense: Expense) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/Expenses`)
          .ref.where('id', '==', expense.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id; // Get the actual Firestore document ID
              return this.afs
                .doc(`/Users/${user.uid}/Expenses/${docId}`)
                .delete();
            } else {
              throw new Error('Expense not found');
            }
          });
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  editExpense(expense: Expense) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/Expenses`)
          .ref.where('id', '==', expense.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id; // Get actual Firestore document ID
              return this.afs
                .doc(`/Users/${user.uid}/Expenses/${docId}`)
                .update(expense);
            } else {
              throw new Error('Expense not found');
            }
          });
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  // Expense Category
  createCategory(payment: Payment) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        payment.id = this.afs.createId();
        return this.afs
          .collection(`/Users/${user.uid}/ExpenseCategory`)
          .add(payment);
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  getAllCategory(): Observable<DocumentChangeAction<any>[]> {
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/ExpenseCategory`)
            .snapshotChanges();
        } else {
          return of([]);
        }
      })
    );
  }

  editCategory(payment: Payment) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/ExpenseCategory`)
          .ref.where('id', '==', payment.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id;
              return this.afs
                .doc(`/Users/${user.uid}/ExpenseCategory/${docId}`)
                .update(payment);
            } else {
              throw new Error('Category not found');
            }
          });
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  deleteCategory(payment: Payment) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/ExpenseCategory`)
          .ref.where('id', '==', payment.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id;
              return this.afs
                .doc(`/Users/${user.uid}/ExpenseCategory/${docId}`)
                .delete();
            } else {
              throw new Error('Category not found');
            }
          });
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  // Profile
  createProfile(profile: Profile) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        profile.id = this.afs.createId();
        return this.afs.collection(`/Users/${user.uid}/Profile`).add(profile);
      } else {
        throw new Error('User Profile not updated');
      }
    });
  }

  getProfileData(): Observable<DocumentChangeAction<any>[]> {
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/Profile`)
            .snapshotChanges();
        } else {
          return of();
        }
      })
    );
  }

  editProfile(profile: Profile) {
    return this.fireauth.currentUser.then((user) => {
      console.log('user', user);
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/Profile`)
          .ref.where('id', '==', profile.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id; // Get actual Firestore document ID
              return this.afs
                .doc(`/Users/${user.uid}/Profile/${docId}`)
                .update(profile);
            } else {
              throw new Error('Profile not found');
            }
          });
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  // Income
  addIncome(income: Income) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        income.id = this.afs.createId();
        return this.afs.collection(`/Users/${user.uid}/Income`).add(income);
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  getAllIncome(): Observable<DocumentChangeAction<any>[]> {
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/Income`)
            .snapshotChanges();
        } else {
          return of([]);
        }
      })
    );
  }

  deleteIncome(income: Income) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/Income`)
          .ref.where('id', '==', income.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id;
              return this.afs
                .doc(`/Users/${user.uid}/Income/${docId}`)
                .delete();
            } else {
              throw new Error('Income not found');
            }
          });
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  editIncome(income: Income) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/Income`)
          .ref.where('id', '==', income.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id;
              return this.afs
                .doc(`/Users/${user.uid}/Income/${docId}`)
                .update(income);
            } else {
              throw new Error('Income not found');
            }
          });
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  // Income Category
  createIncomeCategory(incomeMode: IncomeMode) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        incomeMode.id = this.afs.createId();
        return this.afs
          .collection(`/Users/${user.uid}/IncomeCategory`)
          .add(incomeMode);
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  getAllIncomeCategory(): Observable<DocumentChangeAction<any>[]> {
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/IncomeCategory`)
            .snapshotChanges();
        } else {
          return of([]);
        }
      })
    );
  }

  editIncomeCategory(incomeMode: IncomeMode) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/IncomeCategory`)
          .ref.where('id', '==', incomeMode.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id;
              return this.afs
                .doc(`/Users/${user.uid}/IncomeCategory/${docId}`)
                .update(incomeMode);
            } else {
              throw new Error('Category not found');
            }
          });
      } else {
        throw new Error('User not logged in');
      }
    });
  }

  deleteIncomeCategory(incomeMode: IncomeMode) {
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/IncomeCategory`)
          .ref.where('id', '==', incomeMode.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id;
              return this.afs
                .doc(`/Users/${user.uid}/IncomeCategory/${docId}`)
                .delete();
            } else {
              throw new Error('Category not found');
            }
          });
      } else {
        throw new Error('User not logged in');
      }
    });
  }
}
