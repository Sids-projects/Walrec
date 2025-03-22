import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Expense } from '../model/expense';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Profile } from '../model/profile';
import { Payment } from '../model/payment';
import { Income } from '../model/income';
import { IncomeMode } from '../model/income-mode';
import { Budget } from '../model/budget';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private afs: AngularFirestore,
    private fireauth: AngularFireAuth,
    private loadingService: LoadingService
  ) {}

  // Expense
  addExpense(expense: Expense) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser
      .then((user) => {
        if (user) {
          expense.id = this.afs.createId();
          return this.afs
            .collection(`/Users/${user.uid}/Expenses`)
            .add(expense);
        } else {
          throw new Error('User not logged in');
        }
      })
      .finally(() => this.loadingService.stopLoading());
  }

  getAllExpense(): Observable<DocumentChangeAction<any>[]> {
    this.loadingService.startLoading();
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/Expenses`)
            .snapshotChanges()
            .pipe(
              map((data) => {
                this.loadingService.stopLoading();
                return data;
              })
            );
        } else {
          this.loadingService.stopLoading();
          return of([]);
        }
      })
    );
  }

  deleteExpense(expense: Expense) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/Expenses`)
          .ref.where('id', '==', expense.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id;
              return this.afs
                .doc(`/Users/${user.uid}/Expenses/${docId}`)
                .delete();
            } else {
              throw new Error('Expense not found');
            }
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  editExpense(expense: Expense) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/Expenses`)
          .ref.where('id', '==', expense.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id;
              return this.afs
                .doc(`/Users/${user.uid}/Expenses/${docId}`)
                .update(expense);
            } else {
              throw new Error('Expense not found');
            }
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  // Expense Category
  createCategory(payment: Payment) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        payment.id = this.afs.createId();
        return this.afs
          .collection(`/Users/${user.uid}/ExpenseCategory`)
          .add(payment)
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  getAllCategory(): Observable<DocumentChangeAction<any>[]> {
    this.loadingService.startLoading();
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/ExpenseCategory`)
            .snapshotChanges()
            .pipe(
              map((data) => {
                this.loadingService.stopLoading();
                return data;
              })
            );
        } else {
          this.loadingService.stopLoading();
          return of([]);
        }
      })
    );
  }

  editCategory(payment: Payment) {
    this.loadingService.startLoading();
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
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  deleteCategory(payment: Payment) {
    this.loadingService.startLoading();
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
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  // Income
  addIncome(income: Income) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        income.id = this.afs.createId();
        return this.afs
          .collection(`/Users/${user.uid}/Income`)
          .add(income)
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  getAllIncome(): Observable<DocumentChangeAction<any>[]> {
    this.loadingService.startLoading();
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/Income`)
            .snapshotChanges()
            .pipe(
              map((data) => {
                this.loadingService.stopLoading();
                return data;
              })
            );
        } else {
          this.loadingService.stopLoading();
          return of([]);
        }
      })
    );
  }

  deleteIncome(income: Income) {
    this.loadingService.startLoading();
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
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  editIncome(income: Income) {
    this.loadingService.startLoading();
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
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  // Income Category
  createIncomeCategory(incomeMode: IncomeMode) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        incomeMode.id = this.afs.createId();
        return this.afs
          .collection(`/Users/${user.uid}/IncomeCategory`)
          .add(incomeMode)
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  getAllIncomeCategory(): Observable<DocumentChangeAction<any>[]> {
    this.loadingService.startLoading();
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/IncomeCategory`)
            .snapshotChanges()
            .pipe(
              map((data) => {
                this.loadingService.stopLoading();
                return data;
              })
            );
        } else {
          this.loadingService.stopLoading();
          return of([]);
        }
      })
    );
  }

  editIncomeCategory(incomeMode: IncomeMode) {
    this.loadingService.startLoading();
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
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  deleteIncomeCategory(incomeMode: IncomeMode) {
    this.loadingService.startLoading();
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
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  // Budget
  addBudget(budged: Budget) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        budged.id = this.afs.createId();
        return this.afs
          .collection(`/Users/${user.uid}/Budget`)
          .add(budged)
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  getAllBudget(): Observable<DocumentChangeAction<any>[]> {
    this.loadingService.startLoading();
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/Budget`)
            .snapshotChanges()
            .pipe(
              map((data) => {
                this.loadingService.stopLoading();
                return data;
              })
            );
        } else {
          this.loadingService.stopLoading();
          return of([]);
        }
      })
    );
  }

  deleteBudget(budget: Budget) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/Budget`)
          .ref.where('id', '==', budget.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id;
              return this.afs
                .doc(`/Users/${user.uid}/Budget/${docId}`)
                .delete();
            } else {
              throw new Error('Budget not found');
            }
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  editBudget(budget: Budget) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        return this.afs
          .collection(`/Users/${user.uid}/Budget`)
          .ref.where('id', '==', budget.id)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id;
              return this.afs
                .doc(`/Users/${user.uid}/Budget/${docId}`)
                .update(budget);
            } else {
              throw new Error('Budget not found');
            }
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }

  // Profile
  createProfile(profile: Profile) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser.then((user) => {
      if (user) {
        profile.id = this.afs.createId();
        return this.afs
          .collection(`/Users/${user.uid}/Profile`)
          .add(profile)
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User Profile not updated');
      }
    });
  }

  getProfileData(): Observable<DocumentChangeAction<any>[]> {
    this.loadingService.startLoading();
    return this.fireauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs
            .collection(`/Users/${user.uid}/Profile`)
            .snapshotChanges()
            .pipe(
              map((data) => {
                this.loadingService.stopLoading();
                return data;
              })
            );
        } else {
          this.loadingService.stopLoading();
          return of();
        }
      })
    );
  }

  editProfile(profile: Profile) {
    this.loadingService.startLoading();
    return this.fireauth.currentUser.then((user) => {
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
          })
          .finally(() => this.loadingService.stopLoading());
      } else {
        this.loadingService.stopLoading();
        throw new Error('User not logged in');
      }
    });
  }
}
