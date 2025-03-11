import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Budget } from '../../model/budget';

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
    fromDate: '',
    toDate: '',
    dueDate: '',
    time: '',
    notes: '',
    label: '',
    months: {
      jan: false,
      feb: false,
      mar: false,
      apr: false,
      may: false,
      jun: false,
      jul: false,
      aug: false,
      sep: false,
      oct: false,
      nov: false,
      dec: false,
    },
  };
  monthsList: { display: string; keyValue: string }[] = [
    { display: 'Jan', keyValue: 'jan' },
    { display: 'Feb', keyValue: 'feb' },
    { display: 'Mar', keyValue: 'mar' },
    { display: 'Apr', keyValue: 'apr' },
    { display: 'May', keyValue: 'may' },
    { display: 'Jun', keyValue: 'jun' },
    { display: 'Jul', keyValue: 'jul' },
    { display: 'Aug', keyValue: 'aug' },
    { display: 'Sep', keyValue: 'sep' },
    { display: 'Oct', keyValue: 'oct' },
    { display: 'Nov', keyValue: 'nov' },
    { display: 'Dec', keyValue: 'dec' },
  ];
  monthsProp: any;

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
      fromDate: new FormControl(),
      toDate: new FormControl(),
      dueDate: new FormControl(),
      time: new FormControl(),
      notes: new FormControl(''),
      label: new FormControl({ value: 'budget', disabled: true }),
      months: new FormGroup({
        jan: new FormControl(false),
        feb: new FormControl(false),
        mar: new FormControl(false),
        apr: new FormControl(false),
        may: new FormControl(false),
        jun: new FormControl(false),
        jul: new FormControl(false),
        aug: new FormControl(false),
        sep: new FormControl(false),
        oct: new FormControl(false),
        nov: new FormControl(false),
        dec: new FormControl(false),
      }),
    });

    this.monthsProp = this.budgetForm.get('months');
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
      fromDate: '',
      toDate: '',
      dueDate: '',
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
      fromDate: '',
      toDate: '',
      dueDate: '',
      time: '',
      notes: '',
      label: '',
      months: {
        jan: false,
        feb: false,
        mar: false,
        apr: false,
        may: false,
        jun: false,
        jul: false,
        aug: false,
        sep: false,
        oct: false,
        nov: false,
        dec: false,
      },
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
      this.budgetForm.value.fromDate == '' ||
      this.budgetForm.value.toDate == '' ||
      this.budgetForm.value.dueDate == '' ||
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
    this.budgetObj.fromDate = this.budgetForm.value.fromDate;
    this.budgetObj.toDate = this.budgetForm.value.toDate;
    this.budgetObj.dueDate = this.budgetForm.value.dueDate;
    this.budgetObj.time = this.budgetForm.value.time;
    this.budgetObj.notes = this.budgetForm.value.notes;
    this.budgetObj.label = 'budget';
    this.budgetObj.months.jan = this.budgetForm.get('months')?.value.jan;
    this.budgetObj.months.feb = this.budgetForm.get('months')?.value.feb;
    this.budgetObj.months.mar = this.budgetForm.get('months')?.value.mar;
    this.budgetObj.months.apr = this.budgetForm.get('months')?.value.apr;
    this.budgetObj.months.may = this.budgetForm.get('months')?.value.may;
    this.budgetObj.months.jun = this.budgetForm.get('months')?.value.jun;
    this.budgetObj.months.jul = this.budgetForm.get('months')?.value.jul;
    this.budgetObj.months.aug = this.budgetForm.get('months')?.value.aug;
    this.budgetObj.months.sep = this.budgetForm.get('months')?.value.sep;
    this.budgetObj.months.oct = this.budgetForm.get('months')?.value.oct;
    this.budgetObj.months.nov = this.budgetForm.get('months')?.value.nov;
    this.budgetObj.months.dec = this.budgetForm.get('months')?.value.dec;

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

    this.budgetForm.patchValue({
      title: budget.title,
      bank: budget.bank,
      bankCharges: budget.bankCharges,
      amount: budget.amount,
      interest: budget.interest,
      downPay: budget.downPay,
      duration: budget.duration,
      fromDate: budget.fromDate,
      toDate: budget.toDate,
      dueDate: budget.dueDate,
      time: budget.time,
      notes: budget.notes,
      label: 'budget',
      months: {
        jan: budget.months.jan,
        feb: budget.months.feb,
        mar: budget.months.mar,
        apr: budget.months.apr,
        may: budget.months.may,
        jun: budget.months.jun,
        jul: budget.months.jul,
        aug: budget.months.aug,
        sep: budget.months.sep,
        oct: budget.months.oct,
        nov: budget.months.nov,
        dec: budget.months.dec,
      },
    });

    this.openPopupFn();
    this.showSubmit = false;
    this.showUpdate = true;
  }

  updateBudget() {
    if (this.budgetObj.id) {
      this.budgetObj.title = this.budgetForm.value.title;
      this.budgetObj.bank = this.budgetForm.value.bank;
      this.budgetObj.bankCharges = this.budgetForm.value.bank;
      this.budgetObj.amount = this.budgetForm.value.amount;
      this.budgetObj.interest = this.budgetForm.value.interest;
      this.budgetObj.downPay = this.budgetForm.value.downPay;
      this.budgetObj.duration = this.budgetForm.value.duration;
      this.budgetObj.fromDate = this.budgetForm.value.fromDate;
      this.budgetObj.toDate = this.budgetForm.value.toDate;
      this.budgetObj.dueDate = this.budgetForm.value.dueDate;
      this.budgetObj.time = this.budgetForm.value.time;
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
