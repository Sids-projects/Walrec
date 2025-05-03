import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Material
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

// Components
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { ExpensesComponent } from './screens/expenses/expenses.component';
import { IncomeComponent } from './screens/income/income.component';
import { BudgetsComponent } from './screens/budgets/budgets.component';
import { ReportsComponent } from './screens/reports/reports.component';
import { SettingsComponent } from './screens/settings/settings.component';
import { LoginComponent } from './screens/login/login.component';
import { SignupComponent } from './screens/signup/signup.component';

// Firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { ForgotPasswordComponent } from './screens/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './screens/verify-email/verify-email.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CalendarComponent } from './components/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ExpensesComponent,
    IncomeComponent,
    BudgetsComponent,
    ReportsComponent,
    SettingsComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ProfileComponent,
    SpinnerComponent,
    CalendarComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    AppRoutingModule,
    MatTooltipModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatMenuModule,
    FormsModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'walrec-9e5d8',
        appId: '1:820253293958:web:7b2d287619869552258007',
        storageBucket: 'walrec-9e5d8.firebasestorage.app',
        apiKey: 'AIzaSyAIu4UojLVj3N2i0hapseXIo0IRmS-04Ck',
        authDomain: 'walrec-9e5d8.firebaseapp.com',
        messagingSenderId: '820253293958',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
