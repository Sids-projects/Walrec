import { Component, AfterViewInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import { DataService } from '../../shared/data.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Expense } from '../../model/expense';
import { Income } from '../../model/income';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  expenseList: Expense[] = [];
  incomeList: Income[] = [];
  expenseAmount: number = 0;
  incomeAmount: number = 0;
  balance: number = 0;

  incomeChart!: ApexCharts;
  expenseChart!: ApexCharts;

  incomeOptions: any = {
    chart: { type: 'area', height: 350 },
    series: [{ name: 'Income', data: [] }],
    xaxis: { categories: [] },
    stroke: { curve: 'smooth' },
    colors: ['#90EE90'], // Mild green
  };

  expenseOptions: any = {
    chart: { type: 'area', height: 350 },
    series: [{ name: 'Expenses', data: [] }],
    xaxis: { categories: [] },
    stroke: { curve: 'smooth' },
    colors: ['#FF9999'], // Mild red
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getAllExpense();
    this.getAllIncome();
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
          this.updateExpenseChart();
          this.updateSummary();
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
          this.updateIncomeChart();
          this.updateSummary();
        },
        error: (err) => {
          alert('Error while fetching income');
          console.error(err);
        },
      });
  }

  updateIncomeChart() {
    const incomeAmounts = this.incomeList.map((income) => income.amount);
    const incomeDates = this.incomeList.map((income) => income.date);

    this.incomeOptions.series = [{ name: 'Income', data: incomeAmounts }];
    this.incomeOptions.xaxis.categories = incomeDates;

    this.renderCharts();
  }

  updateExpenseChart() {
    const expenseAmounts = this.expenseList.map((expense) => expense.amount);
    const expenseDates = this.expenseList.map((expense) => expense.date);

    this.expenseOptions.series = [{ name: 'Expenses', data: expenseAmounts }];
    this.expenseOptions.xaxis.categories = expenseDates;

    this.renderCharts();
  }

  ngAfterViewInit() {
    this.renderCharts();
  }

  renderCharts() {
    const incomeElement = document.querySelector('#incomeChart');
    if (incomeElement) {
      if (this.incomeChart) {
        this.incomeChart.updateOptions(this.incomeOptions);
      } else {
        this.incomeChart = new ApexCharts(incomeElement, this.incomeOptions);
        this.incomeChart.render();
      }
    } else {
      console.error('Income chart element not found in the DOM');
    }

    const expenseElement = document.querySelector('#expenseChart');
    if (expenseElement) {
      if (this.expenseChart) {
        this.expenseChart.updateOptions(this.expenseOptions);
      } else {
        this.expenseChart = new ApexCharts(expenseElement, this.expenseOptions);
        this.expenseChart.render();
      }
    } else {
      console.error('Expense chart element not found in the DOM');
    }
  }

  updateSummary() {
    this.expenseAmount = this.expenseList.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    this.incomeAmount = this.incomeList.reduce(
      (sum, inc) => sum + inc.amount,
      0
    );
    this.balance = this.incomeAmount - this.expenseAmount;
  }
}
