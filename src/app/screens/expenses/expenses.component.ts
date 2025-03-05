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
    this.expenseForm.reset();
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

  deleteExpense(expense: Expense) {
    if (window.confirm('Are you sure? You want to delete ' + expense.title)) {
      this.dataService.deleteExpense(expense);
    }
  }
}
