import { Component } from '@angular/core';
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

import {
  collection,
  doc,
  docData,
  DocumentReference,
  CollectionReference,
  Firestore, 
  onSnapshot,
  query,
  where,
  Unsubscribe,
  Query,
  DocumentData,
  collectionData,
  collectionChanges,
  docSnapshots,

} from '@angular/fire/firestore';
import { getDatabase, ref, onValue, onDisconnect, set, get, child } from "firebase/database";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'video-chat-app';
  userData: any;
  user$!: Observable<User | null | unknown>;

  constructor(
    private afs: Firestore,
    private auth: Auth,
  ) {

    this.user$ = authState(auth);
    const db = getDatabase();
    const connectedRef = ref(db, ".info/connected");

    this.user$.subscribe(user => {
      this.userData = user
      if (user){

        set(ref(db, 'users/' + this.userData.uid), {
          displayName: this.userData.displayName,
          uid: this.userData.uid,
          status : 'online'
        });


        const presenceRef = ref(db, 'users/' + this.userData.uid);

        onDisconnect(presenceRef).set({
          displayName: this.userData.displayName,
          uid: this.userData.uid,
          status : 'offline'
        })

      };
    });

  }
}
