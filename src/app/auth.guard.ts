import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = !!localStorage.getItem('token');

  if (isLoggedIn) {
    return true; // Allow access
  } else {
    const router = new Router();
    router.navigate(['/login']);
    return false;
  }
};
