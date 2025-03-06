import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { DataService } from '../../shared/data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Profile } from '../../model/profile';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profilePic: string[] = [
    'face',
    'face_2',
    'face_3',
    'sentiment_satisfied',
    'sentiment_very_satisfied',
    'sentiment_neutral',
    'sentiment_sad',
    'sentiment_excited',
    'sentiment_calm',
    'sentiment_stressed',
    'sentiment_frustrated',
    'sentiment_content',
    'sentiment_worried',
  ];
  profileForm!: FormGroup;
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

  constructor(
    private auth: AuthService,
    private fireauth: AngularFireAuth,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.profileForm = new FormGroup({
      profilePic: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      userEmail: new FormControl({ value: '', disabled: true }),
      gender: new FormControl(''),
    });

    this.getUserEmail();
    this.getProfileData();
  }

  getUserEmail() {
    this.fireauth.authState.subscribe((user) => {
      if (user) {
        this.userEmail = user.email ?? '';
      }

      this.profileForm.patchValue({
        userEmail: this.userEmail,
      });
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
          console.log(this.profileList);
        },
        error: (err) => {
          alert('Error while fetching data');
          console.error(err);
        },
      });
  }

  updateAccount() {
    if (
      this.profileForm.value.profilePic == '' ||
      this.profileForm.value.firstName == '' ||
      this.profileForm.value.lastName == '' ||
      this.profileForm.value.userEmail == '' ||
      this.profileForm.value.gender == ''
    ) {
      alert('All the required fields should be filled');
      return;
    }

    this.profileObj.id = '';
    this.profileObj.profilePic = this.profileForm.value.profilePic;
    this.profileObj.firstName = this.profileForm.value.firstName;
    this.profileObj.lastName = this.profileForm.value.lastName;
    this.profileObj.userEmail = this.userEmail;
    this.profileObj.gender = this.profileForm.value.gender;

    this.dataService
      .createProfile(this.profileObj)
      .then(() => {
        this.getProfileData();
      })
      .catch((error) => {
        alert('Error adding expense: ' + error.message);
      });
  }
}
