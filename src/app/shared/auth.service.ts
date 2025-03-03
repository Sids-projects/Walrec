import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private router: Router) {}

  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        localStorage.setItem('token', 'true');

        if (res.user?.emailVerified == true) {
          this.router.navigate(['dashboard']).then(() => {
            window.location.reload();
          });
        } else {
          this.router.navigate(['verifyEmail']);
        }
      },
      (err) => {
        alert('Something went wrong');
        this.router.navigate(['/login']);
      }
    );
  }

  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (res: any) => {
        alert('Account created successfully');
        this.router.navigate(['login']);
        this.sendEmailForVerification(res.user);
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['signup']);
      }
    );
  }

  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['login']).then(() => {
          window.location.reload();
        });
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(
      () => {
        this.router.navigate(['/verifyEmail']);
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  sendEmailForVerification(user: any) {
    user.sendEmailForVerification().then(
      (res: any) => {
        this.router.navigate(['/verifyEmail']);
      },
      (err: any) => {
        alert('Somthing went wrong');
      }
    );
  }
}
