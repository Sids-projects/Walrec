import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Budget } from '../../model/budget';
import { Bank } from '../../model/bank';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent {
  budgetForm!: FormGroup;
  openPopup: boolean = false;
  openCategoryPopup: boolean = false;
  originalData: any = [];
  isAscending: boolean = true;
  showUpdate: boolean = false;
  showSubmit: boolean = true;
  budgetList: Budget[] = [];
  budgetObj: Budget = {
    id: '',
    title: '',
    bank: '',
    bankCharges: 0,
    amount: 0,
    interest: 0,
    downPay: 0,
    duration: 0,
    date: '',
    time: '',
    notes: '',
    label: '',
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.budgetForm = new FormGroup({
      title: new FormControl(''),
      bank: new FormControl(''),
      bankCharges: new FormControl(0),
      amount: new FormControl(0),
      interest: new FormControl(0),
      downPay: new FormControl(0),
      duration: new FormControl(0),
      date: new FormControl(),
      time: new FormControl(),
      notes: new FormControl(''),
      label: new FormControl({ value: 'budget', disabled: true }),
    });

    this.getAllBudget();
  }

  openPopupFn() {
    this.showSubmit = true;
    this.showUpdate = false;
    this.openPopup = true;
  }

  closePopupFn() {
    this.openPopup = false;
    this.resetForm();
  }

  getAllBudget() {
    this.dataService
      .getAllBudget()
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
          this.budgetList = res;
          console.log(this.budgetList);
        },
        error: (err) => {
          alert('Error while fetching data');
          console.error(err);
        },
      });
  }

  resetForm() {
    this.budgetForm.reset({
      label: 'budget',
      title: '',
      bank: '',
      bankCharges: 0,
      amount: 0,
      interest: 0,
      downPay: 0,
      duration: 0,
      date: '',
      time: '',
      notes: '',
    });

    this.budgetObj = {
      id: '',
      title: '',
      bank: '',
      bankCharges: 0,
      amount: 0,
      interest: 0,
      downPay: 0,
      duration: 0,
      date: '',
      time: '',
      notes: '',
      label: '',
    };
  }

  addBudget() {
    if (
      this.budgetForm.value.title == '' ||
      this.budgetForm.value.bank == '' ||
      this.budgetForm.value.bankCharges == 0 ||
      this.budgetForm.value.amount == 0 ||
      this.budgetForm.value.interest == 0 ||
      this.budgetForm.value.downPay == 0 ||
      this.budgetForm.value.duration == 0 ||
      this.budgetForm.value.date == '' ||
      this.budgetForm.value.time == '' ||
      this.budgetForm.value.notes == ''
    ) {
      alert('All the required fields should be filled');
      return;
    }

    this.budgetObj.id = '';
    this.budgetObj.title = this.budgetForm.value.title;
    this.budgetObj.bank = this.budgetForm.value.bank;
    this.budgetObj.bankCharges = this.budgetForm.value.bankCharges;
    this.budgetObj.amount = this.budgetForm.value.amount;
    this.budgetObj.interest = this.budgetForm.value.interest;
    this.budgetObj.downPay = this.budgetForm.value.downPay;
    this.budgetObj.duration = this.budgetForm.value.duration;
    this.budgetObj.date = this.budgetForm.value.date;
    this.budgetObj.time = this.budgetForm.value.time;
    this.budgetObj.notes = this.budgetForm.value.notes;
    this.budgetObj.label = 'budget';

    this.dataService
      .addBudget(this.budgetObj)
      .then(() => {
        this.getAllBudget();
        this.resetForm();
        this.closePopupFn();
      })
      .catch((error) => {
        alert('Error adding expense: ' + error.message);
      });
  }

  editBudget(budget: Budget) {
    this.budgetObj = { ...budget };

    this.budgetForm.setValue({
      title: budget.title,
      bank: budget.bank,
      bankCharges: budget.bankCharges,
      amount: budget.amount,
      interest: budget.interest,
      downPay: budget.downPay,
      duration: budget.duration,
      date: budget.date,
      time: budget.time,
      notes: budget.notes,
      label: 'budget',
    });

    this.openPopupFn();
    this.showSubmit = false;
    this.showUpdate = true;
  }

  updateBudget() {
    if (this.budgetObj.id) {
      this.budgetObj.title = this.budgetForm.value.title;
      this.budgetObj.bank = this.budgetForm.value.bank;
      this.budgetObj.bankCharges = this.budgetForm.value.bankCharges;
      this.budgetObj.amount = this.budgetForm.value.monthlyAmount;
      this.budgetObj.interest = this.budgetForm.value.interest;
      this.budgetObj.downPay = this.budgetForm.value.downPayment;
      this.budgetObj.duration = this.budgetForm.value.duration;
      this.budgetObj.date = this.budgetForm.value.payemntDate;
      this.budgetObj.time = this.budgetForm.value.paymentTime;
      this.budgetObj.notes = this.budgetForm.value.notes;
      this.budgetObj.label = 'budget';

      this.dataService
        .editBudget(this.budgetObj)
        .then(() => {
          this.getAllBudget();
          this.resetForm();
          this.closePopupFn();
        })
        .catch((error) => {
          alert('Error updating expense: ' + error.message);
        });
    }
  }

  deleteBudget(budget: Budget) {
    if (window.confirm('Are you sure? You want to delete ' + budget.title)) {
      this.dataService
        .deleteBudget(budget)
        .then(() => {
          this.getAllBudget();
        })
        .catch((error) => {
          alert('Error deleting budget: ' + error.message);
        });
    }
  }
}
