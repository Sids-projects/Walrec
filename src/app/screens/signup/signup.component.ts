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
  slideIndex: number = 0;
  slides = [false, false, false];
  interval: any;
  viewPasswordKey: boolean = false;
  viewPassword: string = 'password';

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
    this.setActiveSlide(0);
    this.startAutoSlide();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.slideIndex = (this.slideIndex + 1) % this.slides.length;
      this.setActiveSlide(this.slideIndex);
    }, 4000);
  }

  setActiveSlide(index: number) {
    this.slides = [false, false, false];
    this.slides[index] = true;
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

  viewPasswordFn() {
    this.viewPasswordKey = !this.viewPasswordKey;

    if (this.viewPasswordKey) {
      this.viewPassword = 'text';
    } else {
      this.viewPassword = 'password';
    }
  }
}
