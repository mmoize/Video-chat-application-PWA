import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  getDoc,
  orderBy,
  setDoc

} from '@angular/fire/firestore';
import {  } from '@firebase/database';
import { getAuth, updateProfile } from "firebase/auth";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  displayNameForm!: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private afs: Firestore,
  ) { }

  ngOnInit(): void {
    this.displayNameForm = this.formBuilder.group({
      'displayname' : [null, Validators.required]
    });

    
  }

  
  onFormSubmit(form: any) {
    const auth: any = getAuth();
    const displayName = form;
    console.log('selected room', form.displayname);

    updateProfile(auth.currentUser, {
      displayName: form.displayname, photoURL: "https://t3.ftcdn.net/jpg/03/91/19/22/360_F_391192211_2w5pQpFV1aozYQhcIw3FqA35vuTxJKrB.jpg"
    }).then(() => {
      // Profile updated!
      // ...
      console.log("Profile updated")
      this.router.navigate(['/chat']);
    }).catch((error) => {
      // An error occurred
      // ...
      console.log("Profile not updated")
    });
    

  }

}
