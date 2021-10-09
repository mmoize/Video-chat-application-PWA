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
import { setDoc } from '@firebase/firestore';
import { getDatabase, ref, onValue, onDisconnect, set, get, child,  } from "firebase/database";





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
  
  this.user$ = authState(auth);
  const db = getDatabase();
  const connectedRef = ref(db, ".info/connected");
  

  this.user$.subscribe(user => {
    if (user) {

      this.userData = user;
      localStorage.setItem('user', JSON.stringify(this.userData.providerData[0]));
      JSON.parse(localStorage.getItem('user') || '{}');
      
      const presenceRef = ref(db, 'users/' + this.userData.uid);

      set(ref(db, 'users/' + this.userData.uid), {
        displayName: this.userData.displayName,
        uid: this.userData.uid,
        status : 'online'
      });

      onDisconnect(presenceRef).set({
        displayName: this.userData.displayName,
        uid: this.userData.uid,
        status : 'offline'
      })

    };
  })

  }


  //Selects a random user picture upon signup
  profilePictures = [
    {
      id: 1,
      url: "https://wallpaperaccess.com/full/2213426.jpg"
    },
    {
      id: 2,
      url: "https://wallpaperaccess.com/full/2213475.jpg"
    },
    {
      id: 3,
      url: "https://images.hdqwalls.com/download/crazy-neon-eye-teeth-nr-1920x1080.jpg"
    },
    {
      id: 4,
      url: "https://i.pinimg.com/originals/de/24/d4/de24d41e3d11fd2a3818a5a4122d6bd6.png"
    },
    {
      id: 5,
      url: "https://i.pinimg.com/originals/b0/6c/7d/b06c7d765a3b0ccdd0cb1a7ef452c6b7.jpg"
    },
    {
      id: 6,
      url: "https://i.pinimg.com/originals/6e/8a/33/6e8a337d5773104a5ea6d4a52fe6ebd0.png"
    },
    {
      id: 7,
      url: "https://i.imgur.com/ydHflYJ.jpg"
    },
    {
      id: 8,
      url: "https://i.imgur.com/U3JgmVX.jpg"
    },
    {
      id: 9,
      url: "https://i.pinimg.com/originals/b7/70/b6/b770b678443164f98d7cd8b801e07937.jpg"
    },
    {
      id: 10,
      url: "https://i.pinimg.com/736x/e5/94/ee/e594ee658bfa884c838cfe989d111500--wallpapers-android-iphone--wallpaper.jpg"
    },
    {
      id: 11,
      url: "https://i.pinimg.com/736x/24/06/fc/2406fcb40863a68eb81fe584cc93704f--man-illustration-digital-illustration.jpg"
    },
    {
      id: 12,
      url: "https://wallpapercave.com/wp/wp1977660.jpg"
    },
    {
      id: 13,
      url: "https://mendolaart.com/wp-content/uploads/2016/02/THUMB__cosi.jpg"
    },
    {
      id: 14,
      url: "https://i.imgur.com/ePasIsf.jpg"
    },
    {
      id: 15,
      url: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/7238c754934617.596f8ff8e6d74.jpg"
    }

  ]

  Rand(min: number, max: number): number {
    return (Math.random() * (max - min + 1) | 0) + min;
  } 


  randProfilePic(): string | undefined {
    const randNumber = this.Rand(1,15);
    const pic = this.profilePictures.find(x => x.id === randNumber);
    return pic?.url;
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
      this.router.navigate(['chat']);
    });
    console.log("logged in user", resData);
    this.setUserData(resData.user);
  }).catch((error) => {
    console.log("Issue with email login", error);
    window.alert(error.message);
  });
}


async emailSignUp(email: string, password: string, username: string): Promise<void> {

  const credential = await createUserWithEmailAndPassword(
    this.auth,
    email,
    password
  );
  await updateProfile(
    credential.user, { displayName: username, photoURL: this.randProfilePic()}
  ).then(resData => {
    console.log("update user display name 1", credential.user );
    console.log("update user display name 2", resData );
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

  async setUserData(user:any) {
  console.log("user uiid", user.uid)
  console.log("user uiid", user.providerData[0])
  const userProfile = user;
  const userRef = doc( this.afs,`user/${user.uid}`);
  const db = getDatabase();
  console.log("user uiid",userProfile)
  
  const userData: UserData = {
    uid: userProfile.uid,
    email:userProfile.email,
    displayName:userProfile.displayName,
    photoURL: userProfile.photoURL,
    emailVerified: user.emailVerified,
    status:'online'
  }


  await set(ref(db, `users/${userProfile.uid}`), {
    displayName: userProfile.displayName,
    uid: userProfile.uid,
    status : 'online'
  });

  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userProfile.uid}`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
  }).catch((error) => {
    console.error(error);
  });


  return await setDoc(userRef, {userData}, {
    merge: true
  } )

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



logout() {
  localStorage.removeItem('user');
}






}
