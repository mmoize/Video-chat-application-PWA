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
import { collection, collectionData, CollectionReference, Firestore, orderBy, query, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$!: Observable<User | null | unknown>;
  profileData:any;
  currentChats:any;

  constructor(
    private auth: Auth,
    private afs: Firestore,
    authService:AuthService) { 


    this.user$ = authState(auth);
    console.log("userdata", this.user$);

    this.user$.subscribe(user => {
      if (user) {
        console.log("userdata", user);
        this.profileData = user;

        collectionData(
          query(
            collection(this.afs, 'userchatsrooms/') as CollectionReference<any>,
            where('messageFor.uid', '==', this.profileData.uid),
            orderBy('messageFor.date', 'desc')
          ), { idField: 'id' }
        ).subscribe(resData => {
          console.log("the current chats", resData)
          this.currentChats = resData
        });


      };
    })


  }




  ngOnInit() {



  }

}
