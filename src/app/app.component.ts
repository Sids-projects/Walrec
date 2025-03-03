import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'walrec';
  isLoggedIn = false;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false; // Update UI after logout
  }

  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token'); // Ensure dynamic update
  }
}
