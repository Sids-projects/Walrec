import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/loading.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  isLoading = false;

  constructor(private router: Router, private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe((state) => {
      this.isLoading = state;
    });
  }

  routeToLogin() {
    this.router.navigate(['login']);
  }
}
