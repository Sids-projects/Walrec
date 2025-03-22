import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingService } from '../../shared/loading.service';

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
  isLoading = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private loadingService: LoadingService
  ) {
    this.loadingService.loading$.subscribe((state) => {
      this.isLoading = state;
    });
  }

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
