import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { Expense } from '../../model/expense';
import { AuthService } from '../../shared/auth.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Payment } from '../../model/payment';
import { Subscription } from 'rxjs';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  expenseForm!: FormGroup;
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
  expenseList: Expense[] = [];
  expenseObj: Expense = {
    id: '',
    title: '',
    amount: 0,
    time: '',
    date: '',
    payment: 0,
    notes: '',
    label: 'expense',
  };
  // Payment Method
  paymentMethod: Payment[] = [
    { id: '01', value: 'Cash', creation: 'default' },
    { id: '02', value: 'Credit Card', creation: 'default' },
    { id: '03', value: 'Debit Card', creation: 'default' },
    { id: '04', value: 'Bank Transfer', creation: 'default' },
    { id: '05', value: 'Digital Wallet', creation: 'default' },
  ];
  paymentList: Payment[] = [];
  paymentObj: Payment = {
    id: '',
    value: '',
    creation: 'custom',
  };
  newDate = new Date();
  togglesKey: string = 'table';
  screenWidth!: number;
  screenHeight!: number;
  private screenSizeSub!: Subscription;

  constructor(
    private dataService: DataService,
    private auth: AuthService,
    private sharedService: SharedService
  ) {
    console.log(this.newDate);
  }

  ngOnInit() {
    this.expenseForm = new FormGroup({
      title: new FormControl(''),
      amount: new FormControl(0),
      time: new FormControl(),
      date: new FormControl(),
      payment: new FormControl('Cash'),
      notes: new FormControl(''),
      label: new FormControl({ value: 'expense', disabled: true }),
    });

    this.categoryForm = new FormGroup({
      categoryName: new FormControl(''),
    });

    this.screenSizeSub = this.sharedService.screenSize$.subscribe((size) => {
      this.screenWidth = size.width;
      this.screenHeight = size.height;
    });

    this.getAllExpense();
    this.getAllCategory();
  }

  ngOnDestroy() {
    if (this.screenSizeSub) this.screenSizeSub.unsubscribe();
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
      time: '',
      date: '',
      payment: 'Cash',
      notes: '',
      label: 'expense',
    });

    this.expenseObj = {
      id: '',
      title: '',
      amount: 0,
      time: '',
      date: '',
      payment: 0,
      notes: '',
      label: '',
    };
  }

  addExpense() {
    if (
      this.expenseForm.value.title == '' ||
      this.expenseForm.value.amount == '' ||
      this.expenseForm.value.date == '' ||
      this.expenseForm.value.time == '' ||
      this.expenseForm.value.payment == '' ||
      this.expenseForm.value.label == 'expense'
    ) {
      alert('All the required fields should be filled');
      return;
    }

    this.expenseObj.id = '';
    this.expenseObj.title = this.expenseForm.value.title;
    this.expenseObj.amount = this.expenseForm.value.amount;
    this.expenseObj.time = this.expenseForm.value.time;
    this.expenseObj.date = this.expenseForm.value.date;
    this.expenseObj.payment = this.expenseForm.value.payment;
    this.expenseObj.notes = this.expenseForm.value.notes;
    this.expenseObj.label = 'expense';

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
      time: expense.time,
      date: expense.date,
      payment: expense.payment,
      notes: expense.notes,
      label: 'expense',
    });

    this.openPopupFn();

    this.showSubmit = false;
    this.showUpdate = true;
  }

  updateExpense() {
    if (this.expenseObj.id) {
      this.expenseObj.title = this.expenseForm.value.title;
      this.expenseObj.amount = this.expenseForm.value.amount;
      this.expenseObj.time = this.expenseForm.value.time;
      this.expenseObj.date = this.expenseForm.value.date;
      this.expenseObj.payment = this.expenseForm.value.payment;
      this.expenseObj.notes = this.expenseForm.value.notes;
      this.expenseObj.label = 'expense';

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

  deleteExpense(expense: Expense) {
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

  // Category
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
    this.resetCategoryForm();
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
      .getAllCategory()
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
    this.paymentObj = { ...payment }; // Clone the expense object
    console.log('Editing Expense:', this.expenseObj.id);

    // Populate the form before opening the popup
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
        .editCategory(this.paymentObj)
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
        .deleteCategory(payment)
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
      .createCategory(this.paymentObj)
      .then(() => {
        this.getAllCategory();
        this.resetForm();
        this.closeCategoryPopup();
      })
      .catch((error) => {
        alert('Error adding category: ' + error.message);
      });
  }

  togglesFn(param: string) {
    this.togglesKey = param;
  }
}
