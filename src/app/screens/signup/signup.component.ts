import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm!: FormGroup;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  signup() {
    if (
      this.signupForm.value.email !== '' &&
      this.signupForm.value.password !== ''
    ) {
      this.auth.register(
        this.signupForm.value.email,
        this.signupForm.value.password
      );
      this.signupForm.reset();
    } else {
      alert('Please Enter Email and Password');
      return;
    }
  }

  loginRoute() {
    this.router.navigate(['login']);
  }
}
