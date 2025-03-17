import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DataService } from './shared/data.service';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Profile } from './model/profile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'walrec';
  isLoggedIn = false;
  userEmail: string = '';
  profileList: Profile[] = [];
  profileObj: Profile = {
    id: '',
    profilePic: '',
    firstName: '',
    lastName: '',
    userEmail: '',
    gender: '',
  };
  colorMode: boolean = false;
  currentMode!: any;

  constructor(
    private auth: AuthService,
    private fireauth: AngularFireAuth,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.getUserEmail();
    this.getProfileData();
    // Convert string to boolean
    this.currentMode = localStorage.getItem('darkMode') === 'true';

    // Apply the class if dark mode is on
    if (this.currentMode) {
      document.body.classList.add('dark');
    }
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
  }

  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  getUserEmail() {
    this.fireauth.authState.subscribe((user) => {
      if (user) {
        this.userEmail = user.email ?? '';
      }
    });
  }

  getProfileData() {
    this.dataService
      .getProfileData()
      .pipe(
        map((res: DocumentChangeAction<any>[]) =>
          res.map((e) => {
            const data = e.payload.doc.data();
            return { id: e.payload.doc.id, ...data };
          })
        )
      )
      .subscribe({
        next: (res) => {
          this.profileList = res;
        },
        error: (err) => {
          alert('Error while fetching data');
          console.error(err);
        },
      });
  }

  colorModeFn() {
    this.currentMode = !this.currentMode; // Toggle the mode
    const body = document.body;

    // Save the mode and toggle class
    localStorage.setItem('darkMode', this.currentMode.toString());
    body.classList.toggle('dark', this.currentMode);
  }
}
