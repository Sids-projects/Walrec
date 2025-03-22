import { Component } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Expense } from '../../model/expense';
import { Income } from '../../model/income';
import { Subscription } from 'rxjs';
import { SharedService } from '../../shared/shared.service';
import { LoadingService } from '../../shared/loading.service';

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
    const allData = [...this.expenseList, ...this.incomeList];

    // Sort by date (latest first)
    allData.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Get today's date and yesterday's date
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Reset lists
    this.todayList = [];
    this.yesterdayList = [];
    this.olderList = [];

    // Categorize data
    allData.forEach((item) => {
      if (item.date === today) {
        this.todayList.push(item);
      } else if (item.date === yesterdayStr) {
        this.yesterdayList.push(item);
      } else {
        this.olderList.push(item);
      }
    });
  }

  togglesFn(param: string) {
    this.togglesKey = param;
  }
}
