import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  expenseForm!: FormGroup;
  summaryData: any = [];
  openPopup: boolean = false;
  originalData: any = [];
  isAscending: boolean = true;

  paymentMethod: { value: string; display: string }[] = [
    { value: 'Cash', display: 'Cash' },
    { value: 'Credit Card', display: 'Credit Card' },
    { value: 'Debit Card', display: 'Debit Card' },
    { value: 'Bank Transfer', display: 'Bank Transfer' },
    { value: 'Digital Wallet', display: 'Digital Wallet' },
  ];

  constructor() {}

  ngOnInit() {
    this.expenseForm = new FormGroup({
      title: new FormControl(''),
      amount: new FormControl(0),
      date: new FormControl(),
      payment: new FormControl('Cash'),
      notes: new FormControl(''),
    });

    this.summaryData = [];

    this.originalData = [...this.summaryData];
  }

  openPopupFn() {
    this.openPopup = true;
  }

  closePopupFn() {
    this.openPopup = false;
  }

  formSubmit() {
    const newExpense = {
      ...this.expenseForm.value,
      id: this.summaryData.length + 1,
    };
    this.summaryData.push(newExpense);
    this.expenseForm.reset();
    this.openPopup = false;
  }

  sortFn() {
    this.summaryData.sort((a: any, b: any) => {
      return this.isAscending ? a.amount - b.amount : b.amount - a.amount;
    });

    this.isAscending = !this.isAscending;
  }

  resetTable() {
    this.summaryData = [...this.originalData];
  }
}
