import { Component, AfterViewInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import { DataService } from '../../shared/data.service';
import { AuthService } from '../../shared/auth.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Expense } from '../../model/expense';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  expenseList: Expense[] = [];
  expenseAmount: number = 0;

  lineChart!: ApexCharts;
  barChart!: ApexCharts;

  lineOptions: any = {
    chart: {
      type: 'line',
      height: 350,
    },
    series: [
      {
        name: 'Expenses',
        data: [], // Will be updated dynamically
      },
    ],
    xaxis: {
      categories: [], // Will be updated dynamically
    },
    stroke: {
      curve: 'smooth',
    },
    markers: {
      size: 5,
    },
  };

  constructor(private dataService: DataService, private auth: AuthService) {}

  ngOnInit() {
    this.getAllExpense();
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
          this.updateCharts();
          this.updateExpenseCube();
        },
        error: (err) => {
          alert('Error while fetching data');
          console.error(err);
        },
      });
  }

  updateCharts() {
    const expenseAmounts = this.expenseList.map((expense) => expense.amount);
    const expenseDates = this.expenseList.map((expense) => expense.date);

    this.lineOptions.series = [{ name: 'Expenses', data: expenseAmounts }];
    this.lineOptions.xaxis.categories = expenseDates;

    this.renderCharts();
  }

  ngAfterViewInit() {
    this.renderCharts();
  }

  renderCharts() {
    const lineElement = document.querySelector('#lineChart');
    if (lineElement) {
      if (this.lineChart) {
        this.lineChart.updateOptions(this.lineOptions);
      } else {
        this.lineChart = new ApexCharts(lineElement, this.lineOptions);
        this.lineChart.render();
      }
    } else {
      console.error('Line chart element not found in the DOM');
    }
  }

  updateExpenseCube() {
    const amount: any = [];
    for (let i = 0; i < this.expenseList.length; i++) {
      amount.push(this.expenseList[i].amount);
    }

    this.expenseAmount = amount.reduce(addFn, 0);
    function addFn(add: any, a: any) {
      return add + a;
    }
  }
}
