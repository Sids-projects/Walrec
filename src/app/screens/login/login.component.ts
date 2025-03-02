import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router) {}
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  login() {}

  signupRoute() {
    this.router.navigate(['signup']);
  }
}
