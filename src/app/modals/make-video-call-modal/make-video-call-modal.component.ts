import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogData } from 'src/app/home/callinfo-dialog/callinfo-dialog.component';
import { ModalsService } from '../../modals.service';
import {
    collection,
    doc,
    docData,
    DocumentReference,
    CollectionReference,
    Firestore,
    onSnapshot,
    query,
    Unsubscribe,
    Query,
    where,
    DocumentData,
    collectionData,
    collectionChanges,
    docSnapshots,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    getDocs,
    FieldPath,
    WhereFilterOp,
    orderBy,
    deleteDoc
  } from '@angular/fire/firestore';
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

@Component({
  selector: 'app-make-video-call-modal',
  templateUrl: './make-video-call-modal.component.html',
  styleUrls: ['./make-video-call-modal.component.scss']
})
export class MakeVideoCallModalComponent implements OnInit {
  @Input() id!: string;

  callingUserData:any;
  user$!: Observable<User | null | unknown>;
  curentUserData:any;
  callDenied = false;

  constructor(
      private auth: Auth,
      private afs: Firestore,
      private modalService:ModalsService , 
      public dialogRef: MatDialogRef<MakeVideoCallModalComponent >,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,) 
      {
        this.user$ = authState(auth);
        this.user$.subscribe(async user => {
            this.curentUserData = user

        // Subscription listening to current call being answered
        collectionData(
            query(
            collection(this.afs, 'in-progress-video-call/') as CollectionReference<any>,
            where('videoCallFrom.uid', '==', this.curentUserData.uid),
            where('videoCallFrom.callStatus', '==', 'call accepted')
            ), { idField: 'id' }
        ).subscribe(resData => {
            console.log("person calling has ended the call")
            if (resData.length >= 1) {
               this.dialogRef.close({callStatus:'call accepted'});
            }
        });



        // Subscription listening to current call status
        collectionData(
            query(
            collection(this.afs, 'in-progress-video-call/') as CollectionReference<any>,
            where('videoCallFrom.uid', '==', this.curentUserData.uid),
            where('videoCallFrom.callStatus', '==', 'call denied')
            ), { idField: 'id' }
        ).subscribe(resData => {
            console.log("person calling has ended the call")
            if (resData.length >= 1) {
                this.callDenied = true;
            }
        });
            
        })
    }

  ngOnInit(): void {
      const receivedData = this.data
      this.callingUserData = receivedData.userData

        // Subscription listening to current call status
        collectionData(
            query(
            collection(this.afs, 'in-progress-video-call/') as CollectionReference<any>,
            where('videoCallFrom.uid', '==', this.curentUserData.uid),
            where('videoCallFrom.callStatus', '==', 'call denied')
            ), { idField: 'id' }
        ).subscribe(resData => {
            console.log("person calling has ended the call")
            if (resData.length >= 1) {
                this.callDenied = true;
            }
        });

  }

}
