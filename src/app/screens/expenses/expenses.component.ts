import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { Expense } from '../../model/expense';
import { AuthService } from '../../shared/auth.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  expenseForm!: FormGroup;
  openPopup: boolean = false;
  originalData: any = [];
  isAscending: boolean = true;
  showUpdate: boolean = false;
  showSubmit: boolean = true;
  // Payment Method
  paymentMethod: { value: string; display: string }[] = [
    { value: 'Cash', display: 'Cash' },
    { value: 'Credit Card', display: 'Credit Card' },
    { value: 'Debit Card', display: 'Debit Card' },
    { value: 'Bank Transfer', display: 'Bank Transfer' },
    { value: 'Digital Wallet', display: 'Digital Wallet' },
  ];
  expenseList: Expense[] = [];
  expenseObj: Expense = {
    id: '',
    title: '',
    amount: 0,
    date: '',
    payment: 0,
    notes: '',
  };

  constructor(private dataService: DataService, private auth: AuthService) {}

  ngOnInit() {
    this.expenseForm = new FormGroup({
      title: new FormControl(''),
      amount: new FormControl(0),
      date: new FormControl(),
      payment: new FormControl('Cash'),
      notes: new FormControl(''),
    });

    this.getAllExpense();
  }

  openPopupFn() {
    this.showSubmit = true;
    this.showUpdate = false;

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
    this.expenseForm.reset({
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
    if (
      this.expenseForm.value.title == '' ||
      this.expenseForm.value.amount == '' ||
      this.expenseForm.value.date == '' ||
      this.expenseForm.value.payment == ''
    ) {
      alert('All the required fields should be filled');
      return;
    }

    this.expenseObj.id = '';
    this.expenseObj.title = this.expenseForm.value.title;
    this.expenseObj.amount = this.expenseForm.value.amount;
    this.expenseObj.date = this.expenseForm.value.date;
    this.expenseObj.payment = this.expenseForm.value.payment;
    this.expenseObj.notes = this.expenseForm.value.notes;

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

  editExpense(expense: Expense) {
    this.expenseObj = { ...expense }; // Clone the expense object
    console.log('Editing Expense:', this.expenseObj.id);

    // Populate the form before opening the popup
    this.expenseForm.setValue({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      payment: expense.payment,
      notes: expense.notes,
    });

    this.openPopupFn();

    this.showSubmit = false;
    this.showUpdate = true;
  }

  updateExpense() {
    if (this.expenseObj.id) {
      this.expenseObj.title = this.expenseForm.value.title;
      this.expenseObj.amount = this.expenseForm.value.amount;
      this.expenseObj.date = this.expenseForm.value.date;
      this.expenseObj.payment = this.expenseForm.value.payment;
      this.expenseObj.notes = this.expenseForm.value.notes;

      this.dataService
        .editExpense(this.expenseObj)
        .then(() => {
          this.getAllExpense(); // Refresh expense list
          this.resetForm();
          this.closePopupFn(); // Close the popup after updating
        })
        .catch((error) => {
          alert('Error updating expense: ' + error.message);
        });
    }
  }

  deleteExpense(expense: Expense) {
    if (window.confirm('Are you sure? You want to delete ' + expense.title)) {
      this.dataService
        .deleteExpense(expense)
        .then(() => {
          this.getAllExpense(); // Refresh list after deletion
        })
        .catch((error) => {
          alert('Error deleting expense: ' + error.message);
        });
    }
  }
}
