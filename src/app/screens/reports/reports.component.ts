import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { DataService } from '../../shared/data.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Expense } from '../../model/expense';
import { Income } from '../../model/income';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  expenseList: Expense[] = [];
  incomeList: Income[] = [];

  constructor(private dataService: DataService, private auth: AuthService) {}

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
        },
        error: (err) => {
          alert('Error while fetching data');
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
          console.log(this.incomeList);
        },
        error: (err) => {
          alert('Error while fetching data');
          console.error(err);
        },
      });
  }
}
