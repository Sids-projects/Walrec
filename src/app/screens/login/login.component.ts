import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  slideIndex: number = 0;
  slides = [false, false, false];
  interval: any;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
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

  login() {
    if (
      this.loginForm.value.email !== '' &&
      this.loginForm.value.password !== ''
    ) {
      this.auth.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      this.loginForm.reset();
    } else {
      alert('Please Enter Email and Password');
      return;
    }
  }

  signupRoute() {
    this.router.navigate(['signup']);
  }

  forgotPassword() {
    this.router.navigate(['forgot']);
  }

  signinWithGoogle() {
    this.auth.googleSignIn();
  }
}
