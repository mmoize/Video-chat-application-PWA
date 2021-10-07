import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    orderBy
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
  selector: 'app-receive-video-call-modal',
  templateUrl: './receive-video-call-modal.component.html',
  styleUrls: ['./receive-video-call-modal.component.scss']
})
export class ReceiveVideoCallModalComponent implements OnInit {
  @Input() id!: string;
  
  callingUserData:any;

  constructor( 
    private afs: Firestore,
    private modalService:ModalsService , 
    public dialogRef: MatDialogRef<ReceiveVideoCallModalComponent >,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

  ngOnInit(){
    const receivedData = this.data
    //this.callingUserData = receivedData.userData
    console.log("this is the data from dialog", this.data.userData.videoCallFrom.uid)
  }

  async endCall() {
    const currentvideoChatRoom = doc(this.afs, 'in-progress-video-call/'+ this.data.userData.videoCallFrom.uid);
    await setDoc(currentvideoChatRoom, {
        videoCallFrom:{
          callStatus:'call denied'
        },
      videoCallTo:{
        callStatus:'call denied'
       }
      }, {merge: true} 
    );

    this.dialogRef.close({callStatus:'call denied'})
  }


  async onAnswerCall() {
    const currentvideoChatRoom = doc(this.afs, 'in-progress-video-call/'+ this.data.userData.videoCallFrom.uid);
    await setDoc(currentvideoChatRoom, {
        videoCallFrom:{
          callStatus:'call accepted'
        },
      videoCallTo:{
        callStatus:'call accepted'
       }
      }, {merge: true} 
    );


    this.dialogRef.close({callStatus:'call accepted'})
  }
 

}
