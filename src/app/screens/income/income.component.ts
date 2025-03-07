import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { Income } from '../../model/income';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Payment } from '../../model/payment';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss',
})
export class IncomeComponent {
  incomeForm!: FormGroup;
  categoryForm!: FormGroup;
  openPopup: boolean = false;
  openCategoryPopup: boolean = false;
  originalData: any = [];
  isAscending: boolean = true;
  showUpdate: boolean = false;
  showSubmit: boolean = true;
  showCategory: boolean = false;
  showCategorySubmit: boolean = true;
  showCategoryUpdate: boolean = false;
  incomeList: Income[] = [];
  incomeObj: Income = {
    id: '',
    title: '',
    amount: 0,
    date: '',
    payment: 0,
    notes: '',
  };
  // Payment Method
  paymentMethod: Payment[] = [
    { id: '01', value: 'Salary', creation: 'default' },
    { id: '02', value: 'Lottery', creation: 'default' },
    { id: '03', value: 'Cupon', creation: 'default' },
    { id: '04', value: 'Reward', creation: 'default' },
  ];
  paymentList: Payment[] = [];
  paymentObj: Payment = {
    id: '',
    value: '',
    creation: 'custom',
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.incomeForm = new FormGroup({
      title: new FormControl(''),
      amount: new FormControl(0),
      date: new FormControl(),
      payment: new FormControl('Cash'),
      notes: new FormControl(''),
    });

    this.categoryForm = new FormGroup({
      categoryName: new FormControl(''),
    });

    this.getAllIncome();
    this.getAllCategory();
  }

  openPopupFn() {
    this.showSubmit = true;
    this.showUpdate = false;

    this.openPopup = true;
  }

  closePopupFn() {
    this.openPopup = false;
  }

  getAllIncome() {
    this.dataService
      .getAllIncome()
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
          this.incomeList = res;
          console.log(this.incomeList);
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

    this.incomeObj = {
      id: '',
      title: '',
      amount: 0,
      date: '',
      payment: 0,
      notes: '',
    };
  }

  addIncome() {
    if (
      this.incomeForm.value.title == '' ||
      this.incomeForm.value.amount == '' ||
      this.incomeForm.value.date == '' ||
      this.incomeForm.value.payment == ''
    ) {
      alert('All the required fields should be filled');
      return;
    }

    this.incomeObj.id = '';
    this.incomeObj.title = this.incomeForm.value.title;
    this.incomeObj.amount = this.incomeForm.value.amount;
    this.incomeObj.date = this.incomeForm.value.date;
    this.incomeObj.payment = this.incomeForm.value.payment;
    this.incomeObj.notes = this.incomeForm.value.notes;

    this.dataService
      .addIncome(this.incomeObj)
      .then(() => {
        this.getAllIncome();
        this.resetForm();
        this.closePopupFn();
      })
      .catch((error) => {
        alert('Error adding expense: ' + error.message);
      });
  }

  editIncome(expense: Income) {
    this.incomeObj = { ...expense }; // Clone the expense object
    console.log('Editing Income:', this.incomeObj.id);

    // Populate the form before opening the popup
    this.incomeForm.setValue({
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

  updateIncome() {
    if (this.incomeObj.id) {
      this.incomeObj.title = this.incomeForm.value.title;
      this.incomeObj.amount = this.incomeForm.value.amount;
      this.incomeObj.date = this.incomeForm.value.date;
      this.incomeObj.payment = this.incomeForm.value.payment;
      this.incomeObj.notes = this.incomeForm.value.notes;

      this.dataService
        .editIncome(this.incomeObj)
        .then(() => {
          this.getAllIncome();
          this.resetForm();
          this.closePopupFn();
        })
        .catch((error) => {
          alert('Error updating expense: ' + error.message);
        });
    }
  }

  deleteIncome(income: Income) {
    if (window.confirm('Are you sure? You want to delete ' + income.title)) {
      this.dataService
        .deleteIncome(income)
        .then(() => {
          this.getAllIncome();
        })
        .catch((error) => {
          alert('Error deleting income: ' + error.message);
        });
    }
  }

  categoryView() {
    this.showCategory = !this.showCategory;
  }

  openCategoryPopupFn() {
    this.openCategoryPopup = true;

    this.showCategorySubmit = true;
    this.showCategoryUpdate = false;
  }

  closeCategoryPopup() {
    this.openCategoryPopup = false;
  }

  resetCategoryForm() {
    this.categoryForm.reset({
      categoryName: '',
    });

    this.paymentObj = {
      id: '',
      value: '',
      creation: '',
    };
  }

  getAllCategory() {
    this.dataService
      .getAllIncomeCategory()
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
          let paymentResponse = res;
          this.paymentList = [...this.paymentMethod, ...paymentResponse];
          console.log(this.paymentList);
        },
        error: (err) => {
          alert('Error while fetching data');
          console.error(err);
        },
      });
  }

  editCategory(payment: Payment) {
    this.paymentObj = { ...payment };
    console.log('Editing Expense:', this.incomeObj.id);

    this.categoryForm.setValue({
      categoryName: payment.value,
    });

    this.openCategoryPopupFn();

    this.showCategorySubmit = false;
    this.showCategoryUpdate = true;
  }

  updateCategory() {
    if (this.paymentObj.id) {
      this.paymentObj.value = this.categoryForm.value.categoryName;

      this.dataService
        .editIncomeCategory(this.paymentObj)
        .then(() => {
          this.getAllCategory();
          this.resetCategoryForm();
          this.closeCategoryPopup();
        })
        .catch((error) => {
          alert('Error updating category: ' + error.message);
        });
    }
  }

  deleteCategory(payment: Payment) {
    if (window.confirm('Are you sure? You want to delete ' + payment.value)) {
      this.dataService
        .deleteIncomeCategory(payment)
        .then(() => {
          this.getAllCategory();
        })
        .catch((error) => {
          alert('Error deleting category: ' + error.message);
        });
    }
  }

  createCategory() {
    this.showCategorySubmit = true;
    this.showCategoryUpdate = false;

    if (this.categoryForm.value.categoryName == '') {
      alert('Category Field should be filled');
      return;
    }

    this.paymentObj.id = '';
    this.paymentObj.value = this.categoryForm.value.categoryName;

    this.dataService
      .createIncomeCategory(this.paymentObj)
      .then(() => {
        this.getAllCategory();
        this.resetForm();
        this.closeCategoryPopup();
      })
      .catch((error) => {
        alert('Error adding category: ' + error.message);
      });
  }
}
