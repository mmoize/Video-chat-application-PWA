import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, filter, scan, switchMap, take } from 'rxjs/operators';
import { CallService } from 'src/app/call.service';
import { CallinfoDialogComponent, DialogData } from '../callinfo-dialog/callinfo-dialog.component';
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
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @Input() videoCallData!: Observable<any>;

  user$!: Observable<User | null | unknown>;
  currentUserData:any;

  public isCallStarted$: Observable<boolean>;
  private peerId!: String;


  


  @ViewChild('localVideo')localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;


  constructor(
    public dialog: MatDialog, 
    private callService: CallService,
    private afs: Firestore,
    private auth: Auth,
  ) { 

    this.isCallStarted$ = this.callService.isCallStarted$;
    this.peerId = this.callService.initPeer();

    this.user$ = authState(auth);
    this.user$.subscribe(async user => {

      this.currentUserData = user;
     
      // if (user){
      //   // Subscription When user recieves a call
      //   setTimeout(() =>{ 
      //     collectionData(
      //       query(
      //         collection(this.afs, 'in-progress-video-call/') as CollectionReference<any>,
      //         where('videoCallTo.uid', '==', this.currentUserData.uid),
      //         where('videoCallTo.callStatus', '==', 'call accepted')
      //       ), { idField: 'id' }
      //     ).pipe(take(1)).subscribe(resData => {
      //       if (resData.length >= 1) {
      //         console.log("received calling data", resData[0]);
      //         const CallData = resData[0];
      //         this.receivingVideoCall(new String(CallData.videoCallTo.callID));
      //         //this.receivingVideoCall(this.peerId);
      //       }
      //     });
      //     }, 3000);

      //   // Subscription when current user made the call
      //   setTimeout(() =>{ 
      //     collectionData(
      //       query(
      //         collection(this.afs, 'in-progress-video-call/') as CollectionReference<any>,
      //         where('videoCallFrom.uid', '==', this.currentUserData.uid),
      //         where('videoCallTo.callStatus', '==', 'call accepted')
      //       ), { idField: 'id' }
      //     ).pipe(take(1)).subscribe(async resData => {
      //       if (resData.length >= 1) {
      //         const currentvideoChatRoom = doc(this.afs, 'in-progress-video-call/'+ this.currentUserData.uid);
      //         await setDoc(currentvideoChatRoom, {
      //             videoCallFrom:{
      //               callID: this.peerId
      //             },
      //           videoCallTo:{
      //             callID: this.peerId
      //            }
      //           }, {merge: true} 
      //         );
      //         this.makingVedeoCall();
      //       }
      //     });
      //     }, 2000);
      // };

    });

  }

  ngOnInit(): void {

    this.callService.localStream$
    .pipe(filter(res => !!res))
    .subscribe(stream => this.localVideo.nativeElement.srcObject = stream)
    this.callService.remoteStream$
    .pipe(filter(res => !!res))
    .subscribe(stream => this.remoteVideo.nativeElement.srcObject = stream)
    
    this.onInitiateCallingSystem();
  }




  onInitiateCallingSystem() {
    //this.user$ = authState(auth);
    this.user$.subscribe(async user => {

      this.currentUserData = user;
     
      if (user){
        // Subscription When user recieves a call
        setTimeout(() =>{ 
          collectionData(
            query(
              collection(this.afs, 'in-progress-video-call/') as CollectionReference<any>,
              where('videoCallTo.uid', '==', this.currentUserData.uid),
              where('videoCallTo.callStatus', '==', 'call accepted')
            ), { idField: 'id' }
          ).pipe(take(1)).subscribe(resData => {
            if (resData.length >= 1) {
              console.log("received calling data", resData[0]);
              const CallData = resData[0];
              this.receivingVideoCall(new String(CallData.videoCallTo.callID));
              //this.receivingVideoCall(this.peerId);
            }
          });
          }, 3000);

        // Subscription when current user made the call
        setTimeout(() =>{ 
          collectionData(
            query(
              collection(this.afs, 'in-progress-video-call/') as CollectionReference<any>,
              where('videoCallFrom.uid', '==', this.currentUserData.uid),
              where('videoCallTo.callStatus', '==', 'call accepted')
            ), { idField: 'id' }
          ).pipe(take(1)).subscribe(async resData => {
            if (resData.length >= 1) {
              const currentvideoChatRoom = doc(this.afs, 'in-progress-video-call/'+ this.currentUserData.uid);
              await setDoc(currentvideoChatRoom, {
                  videoCallFrom:{
                    callID: this.peerId
                  },
                videoCallTo:{
                  callID: this.peerId
                 }
                }, {merge: true} 
              );
              this.makingVedeoCall();
            }
          });
          }, 2000);
      };

    });
  }

  ngOnDestroy(): void {
    this.callService.destroyPeer(); 
  }


  receivingVideoCall(callID:any) {
    this.callService.establishMediaCall(callID);
  }

  makingVedeoCall() {
    this.callService.enableCallAnswer();
  }


  public showModal(joinCall: boolean): void {
    let dialogData: DialogData = joinCall ? ({ peerId: null, joinCall: true }) : ({ peerId: this.peerId, joinCall: false });
    const dialogRef = this.dialog.open(CallinfoDialogComponent, {
      width: '250px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(peerId => 
          joinCall ? of(this.callService.establishMediaCall(peerId)) : of(this.callService.enableCallAnswer())
        ),
      )
      .subscribe(_  => { });
  }

  public endCall(){
    this.callService.closeMediaCall();
  }

}
