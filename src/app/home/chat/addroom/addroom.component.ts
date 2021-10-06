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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-addroom',
  templateUrl: './addroom.component.html',
  styleUrls: ['./addroom.component.scss']
})
export class AddroomComponent implements OnInit {

  roomForm!: FormGroup;
  nickname = '';
  roomname = '';
  ref: DocumentData = collectionData(
    query(
      collection(this.afs, 'rooms/') as CollectionReference,
    ), { idField: 'id' }
  );
  matcher = new MyErrorStateMatcher();

  constructor(
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private afs: Firestore,
            ) {
              
             }



  ngOnInit(): void {

    this.roomForm = this.formBuilder.group({
      'roomname' : [null, Validators.required]
    });
  }




  onFormSubmit(form: any) {

    const room = form;
    console.log('selected room', room.roomname);
    
   this.ref= collectionData(
      query(
        collection(this.afs, 'rooms/') as CollectionReference,
         where('roomname', 'not-in', [room.roomname])
      ), { idField: 'id' }
    ).subscribe(async resData => {
      console.log("response data", resData.length);
      if (resData.length != 0) {
        this.snackBar.open('Room name already exist!');
      } else {
        const newRoom = doc(this.afs,'rooms/', room.roomname);
        await setDoc(newRoom, {room} );
        this.router.navigate(['/chat']);
      }
    });

  }




}
