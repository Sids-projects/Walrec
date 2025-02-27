import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { ExpensesComponent } from './screens/expenses/expenses.component';
import { IncomeComponent } from './screens/income/income.component';
import { BudgetsComponent } from './screens/budgets/budgets.component';
import { ReportsComponent } from './screens/reports/reports.component';
import { SettingsComponent } from './screens/settings/settings.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'expense', component: ExpensesComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'budget', component: BudgetsComponent },
  { path: 'report', component: ReportsComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
