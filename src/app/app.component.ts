import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'walrec';
  isLoggedIn = false;
  userEmail: string = '';

  constructor(private auth: AuthService, private fireauth: AngularFireAuth) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.getUserEmail();
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
  }

  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  getUserEmail() {
    this.fireauth.authState.subscribe((user) => {
      if (user) {
        this.userEmail = user.email ?? '';
      }
    });
  }
}
