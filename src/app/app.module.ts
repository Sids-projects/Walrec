import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { ExpensesComponent } from './screens/expenses/expenses.component';
import { IncomeComponent } from './screens/income/income.component';
import { BudgetsComponent } from './screens/budgets/budgets.component';
import { ReportsComponent } from './screens/reports/reports.component';
import { SettingsComponent } from './screens/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ExpensesComponent,
    IncomeComponent,
    BudgetsComponent,
    ReportsComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
