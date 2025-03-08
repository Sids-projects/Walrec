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
  slideIndex: number = 0;
  slides = [false, false, false];
  interval: any;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.forgotForm = new FormGroup({
      email: new FormControl(''),
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

  forgotPassword() {
    this.auth.forgotPassword(this.forgotForm.value.email);
    this.forgotForm.reset();
  }

  loginRoute() {
    this.router.navigate(['login']);
  }
}
