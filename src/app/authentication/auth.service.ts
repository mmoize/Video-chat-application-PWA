import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
import { switchMap, take } from 'rxjs/operators';
import { Collection } from 'typescript';
import { UserData } from '../shared/user';





@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  user$!: Observable<User | null | unknown>;
  userResData: any;

  constructor(
    private afs: Firestore,
    private auth: Auth,
    public router: Router,  
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) { 

  // user observable, not user doc
  //this.user$ = user(auth);

  // // or use this version...
  this.user$ = authState(auth);

  // // or use this version...
  // this.user$ = new Observable((observer: any) =>
  //   onAuthStateChanged(auth, observer)
  // );


  this.user$.subscribe(user => {
    if (user) {
      this.userData = user;
      localStorage.setItem('user', JSON.stringify(this.userData));
      JSON.parse(localStorage.getItem('user') || '{}');
    };
  })

  }


  async getUser(): Promise<User | null> {

    

    await this.user$.pipe(take(1)).toPromise().catch (resData => {
      this.userResData = resData
      console.log("Testing User Results Data", this.userResData);
    })

    return this.userResData;
  }



async emailLogin(email: string, password: string):Promise<any> {
  return await signInWithEmailAndPassword(this.auth, email, password).then(resData => {
    this.ngZone.run(() => {
      this.router.navigate(['/']);
      this.router.navigate(['/chat']);
    });
    console.log("logged in user", resData.user);
    //this.setUserData(resData.user);
  }).catch((error) => {
    console.log("Issue with email login", error);
    window.alert(error.message);
  });
}


async emailSignUp(email: string, password: string): Promise<void> {

  const credential = await createUserWithEmailAndPassword(
    this.auth,
    email,
    password
  );
  await updateProfile(
    credential.user, { displayName: credential.user.displayName }
  ).then(resData => {
    this.setUserData(credential.user)
  });
  await sendEmailVerification(credential.user).then(() => {
    this.router.navigate(['/']);
  });
}

async resetPassword(email: string): Promise<any> {
  // sends reset password email
  await sendPasswordResetEmail(this.auth, email);

}

setUserData(user:any) {
  const userRef: DocumentData = doc( this.afs,`user/${user.uid}`);

  const userData: UserData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified
  }

  userRef.set(userData, {
    merge: true
  })

}

get IsloggedIn():Boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (user !== null && user.emailVerified !== false) ? true: false;

}



async oAuthLogin(p: string): Promise<void> {

  // get provider, sign in
  const provider = new OAuthProvider(p);
  const credential = await signInWithPopup(this.auth, provider);
  const additionalInfo = getAdditionalUserInfo(credential);

  // create user in db
  if (additionalInfo?.isNewUser) {
    await updateProfile(
      credential.user, { displayName: credential.user.displayName }
    ).then(resData => {
      this.setUserData(credential.user)
    });
    await sendEmailVerification(credential.user).then(() => {
      this.router.navigate(['/']);
    });
  }
}









}
