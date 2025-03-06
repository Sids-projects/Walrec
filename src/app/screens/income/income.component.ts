import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { AuthService } from '../../shared/auth.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Income } from '../../model/income';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss',
})
export class IncomeComponent {
  incomeForm!: FormGroup;
  openPopup: boolean = false;
  originalData: any = [];
  isAscending: boolean = true;
  showUpdate: boolean = false;
  showSubmit: boolean = true;
  // Payment Method
  incomeMethod: { value: string; display: string }[] = [
    { value: 'Cash', display: 'Cash' },
    { value: 'Credit Card', display: 'Credit Card' },
    { value: 'Debit Card', display: 'Debit Card' },
    { value: 'Bank Transfer', display: 'Bank Transfer' },
    { value: 'Digital Wallet', display: 'Digital Wallet' },
  ];
  expenseList: Income[] = [];
  expenseObj: Income = {
    id: '',
    title: '',
    amount: 0,
    date: '',
    payment: 0,
    notes: '',
  };

  constructor(private dataService: DataService, private auth: AuthService) {}

  ngOnInit() {
    this.incomeForm = new FormGroup({
      title: new FormControl(''),
      amount: new FormControl(0),
      date: new FormControl(),
      payment: new FormControl('Cash'),
      notes: new FormControl(''),
    });

    this.getAllExpense();
  }

  openPopupFn() {
    this.openPopup = true;
  }

  closePopupFn() {
    this.openPopup = false;
  }

  getAllExpense() {
    this.dataService
      .getAllExpense()
      .pipe(
        map((res: DocumentChangeAction<any>[]) =>
          res.map((e) => {
            const data = e.payload.doc.data();
            return { id: e.payload.doc.id, ...data };
          })
        )
      )
      .subscribe({
        next: (res) => {
          this.expenseList = res;
          console.log(this.expenseList);
        },
        error: (err) => {
          alert('Error while fetching data');
          console.error(err);
        },
      });
  }

  resetForm() {
    this.incomeForm.reset({
      title: '',
      amount: 0,
      date: '',
      payment: 'Cash',
      notes: '',
    });

    this.expenseObj = {
      id: '',
      title: '',
      amount: 0,
      date: '',
      payment: 0,
      notes: '',
    };
  }

  addExpense() {
    this.showSubmit = true;
    this.showUpdate = false;

    if (
      this.incomeForm.value.title == '' ||
      this.incomeForm.value.amount == '' ||
      this.incomeForm.value.date == '' ||
      this.incomeForm.value.payment == ''
    ) {
      alert('All the required fields should be filled');
      return;
    }

    this.expenseObj.id = '';
    this.expenseObj.title = this.incomeForm.value.title;
    this.expenseObj.amount = this.incomeForm.value.amount;
    this.expenseObj.date = this.incomeForm.value.date;
    this.expenseObj.payment = this.incomeForm.value.payment;
    this.expenseObj.notes = this.incomeForm.value.notes;

    this.dataService
      .addExpense(this.expenseObj)
      .then(() => {
        this.getAllExpense();
        this.resetForm();
        this.closePopupFn();
      })
      .catch((error) => {
        alert('Error adding expense: ' + error.message);
      });
  }

  editExpense(expense: Income) {
    this.showSubmit = false;
    this.showUpdate = true;

    this.expenseObj = { ...expense };
    console.log('Editing Expense:', this.expenseObj.id);

    this.incomeForm.setValue({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      payment: expense.payment,
      notes: expense.notes,
    });

    this.openPopupFn();
  }

  updateExpense() {
    if (this.expenseObj.id) {
      this.expenseObj.title = this.incomeForm.value.title;
      this.expenseObj.amount = this.incomeForm.value.amount;
      this.expenseObj.date = this.incomeForm.value.date;
      this.expenseObj.payment = this.incomeForm.value.payment;
      this.expenseObj.notes = this.incomeForm.value.notes;

      this.dataService
        .editExpense(this.expenseObj)
        .then(() => {
          this.getAllExpense();
          this.resetForm();
          this.closePopupFn();
        })
        .catch((error) => {
          alert('Error updating expense: ' + error.message);
        });
    }
  }

  deleteExpense(expense: Income) {
    if (window.confirm('Are you sure? You want to delete ' + expense.title)) {
      this.dataService
        .deleteExpense(expense)
        .then(() => {
          this.getAllExpense();
        })
        .catch((error) => {
          alert('Error deleting expense: ' + error.message);
        });
    }
  }
}
