import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotForm!: FormGroup;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.forgotForm = new FormGroup({
      email: new FormControl(''),
    });
  }

  forgotPassword() {
    this.auth.forgotPassword(this.forgotForm.value.email);
    this.forgotForm.reset();
  }

  loginRoute() {
    this.router.navigate(['login']);
  }
}
