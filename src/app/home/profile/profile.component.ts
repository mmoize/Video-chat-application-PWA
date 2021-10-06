import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import {
  Auth,
  signOut,
  signInWithPopup,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  getAdditionalUserInfo,
  OAuthProvider,
  linkWithPopup,
  unlink,
  updateEmail,
  updatePassword,
  User,
  reauthenticateWithPopup,
  authState,
  onAuthStateChanged
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$!: Observable<User | null | unknown>;
  profileData:any;

  constructor(
    private auth: Auth,
    authService:AuthService) { 


    this.user$ = authState(auth);
    console.log("userdata", this.user$);

    this.user$.subscribe(user => {
      if (user) {
        console.log("userdata", user);
        this.profileData = user;
      };
    })
  }




  ngOnInit(): void {

  }

}
