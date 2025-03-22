import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Profile } from '../../model/profile';
import { map } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/loading.service';

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
  isLoading = false;

  constructor(
    private fireauth: AngularFireAuth,
    private dataService: DataService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.loadingService.loading$.subscribe((state) => {
      this.isLoading = state;
    });
  }

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
          if (this.profileList.length > 0) {
            const profileData = this.profileList[0];

            // Patch values into the form
            this.profileForm.patchValue({
              profilePic: profileData.profilePic,
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              userEmail: profileData.userEmail,
              gender: profileData.gender,
            });
          }
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

  editProfileBtn() {
    if (this.profileList.length != 0) {
      this.profileObj = { ...this.profileList[0] }; // Ensure the profile ID is correct
    }

    if (this.profileObj.id) {
      this.profileObj.profilePic = this.profileForm.value.profilePic;
      this.profileObj.firstName = this.profileForm.value.firstName;
      this.profileObj.lastName = this.profileForm.value.lastName;
      this.profileObj.userEmail = this.userEmail;
      this.profileObj.gender = this.profileForm.value.gender;

      this.dataService
        .editProfile(this.profileObj)
        .then(() => {
          this.getProfileData();
        })
        .catch((error) => {
          alert('Error updating profile: ' + error.message);
        });
    }
  }

  routeTo() {
    this.router.navigate(['dashboard']);
  }
}
