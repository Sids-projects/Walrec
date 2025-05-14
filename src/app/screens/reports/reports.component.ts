import { Component } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Expense } from '../../model/expense';
import { Income } from '../../model/income';
import { Subscription } from 'rxjs';
import { SharedService } from '../../shared/shared.service';
import { LoadingService } from '../../shared/loading.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  expenseList: Expense[] = [];
  incomeList: Income[] = [];

  todayList: any[] = [];
  yesterdayList: any[] = [];
  olderList: any[] = [];
  togglesKey: string = 'table';
  screenWidth!: number;
  screenHeight!: number;
  private screenSizeSub!: Subscription;
  isLoading = false;
  expIncomeData: any[] = [];
  budgetHeaderForm!: FormGroup;

  constructor(
    private dataService: DataService,
    private sharedService: SharedService,
    private loadingService: LoadingService
  ) {
    this.loadingService.loading$.subscribe((state) => {
      this.isLoading = state;
    });
  }

  ngOnInit() {
    this.budgetHeaderForm = new FormGroup({
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
    });

    this.budgetHeaderForm.valueChanges.subscribe(() => {
      this.filterByDateRange();
    });

    this.getAllExpense();
    this.getAllIncome();

    this.screenSizeSub = this.sharedService.screenSize$.subscribe((size) => {
      this.screenWidth = size.width;
      this.screenHeight = size.height;
    });
  }

  ngOnDestroy() {
    if (this.screenSizeSub) this.screenSizeSub.unsubscribe();
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
          this.categorizeData();
        },
        error: (err) => {
          alert('Error while fetching expenses');
          console.error(err);
        },
      });
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
          this.categorizeData();
        },
        error: (err) => {
          alert('Error while fetching incomes');
          console.error(err);
        },
      });
  }

  categorizeData() {
    this.expIncomeData = [...this.expenseList, ...this.incomeList];
    console.log(this.expIncomeData);
  }

  filterByDateRange() {
    const fromDate = this.budgetHeaderForm.get('fromDate')?.value;
    const toDate = this.budgetHeaderForm.get('toDate')?.value;

    if (!fromDate || !toDate) {
      return; // Prevent filtering if one date is missing
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Clear time portion to make it date-only comparison
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    const allData = [...this.expenseList, ...this.incomeList];

    this.expIncomeData = allData.filter((item: any) => {
      const itemDate = new Date(item.date);
      return itemDate >= from && itemDate <= to;
    });
  }

  togglesFn(param: string) {
    this.togglesKey = param;
  }
}
