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

  constructor() {}

  ngOnInit() {
    this.expenseForm = new FormGroup({
      title: new FormControl(''),
      amount: new FormControl(0),
      date: new FormControl(),
      payment: new FormControl('cash'),
      notes: new FormControl(''),
    });
  }

  openPopupFn() {
    this.openPopup = true;
  }

  closePopupFn() {
    this.openPopup = false;
  }

  formSubmit() {
    this.summaryData.push(this.expenseForm.value);
    this.expenseForm.reset();
    this.openPopup = false;
  }
}
