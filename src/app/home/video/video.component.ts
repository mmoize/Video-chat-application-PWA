import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @Input() videoCallData!: Observable<any>;

  user$!: Observable<User | null | unknown>;
  currentUserData:any;
  callerUserData:any;

  public isCallStarted$: Observable<boolean>;
  private peerId!: String;

  @Output() videoCallInProgress = new EventEmitter<boolean>();
  


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
              const CallData = resData[0];
              this.callerUserData = CallData
              this.receivingVideoCall(CallData.videoCallTo.callID);
              //this.receivingVideoCall(this.peerId);
            }
          });
          }, 1000);

        // Subscription when current user made the call 
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
      };

      

    });

  }

  ngOnInit(): void {

    this.callService.localStream$
    .pipe(filter(res => !!res))
    .subscribe(stream => this.localVideo.nativeElement.srcObject = stream)

    this.callService.remoteStream$
    .pipe(filter(res => !!res))
    .subscribe(stream => this.remoteVideo.nativeElement.srcObject = stream)
    
    
  }


  ngOnDestroy(): void {
    this.callService.destroyPeer(); 
  }


  receivingVideoCall(callID:string) {
    console.log("media connection id", callID);
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

  public async endCall(){
    // close the media service after the conclusion of the video call.
    this.callService.closeMediaCall();

    // Delete calling profile from the database after the conclusion of the video call
    if (this.callerUserData){
      await deleteDoc(doc(this.afs, 'in-progress-video-call/'+ this.callerUserData.videoCallFrom.uid));
    } else {
      await deleteDoc(doc(this.afs, 'in-progress-video-call/'+ this.currentUserData.uid));
    }

    this.videoCallInProgress.emit(false);
   
  }

}
