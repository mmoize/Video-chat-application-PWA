import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Peer from 'peerjs';
import { async, BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  private peer: Peer = new Peer;
  private medialCall!: Peer.MediaConnection;

  private localStreamBs: BehaviorSubject<MediaStream | null> = new BehaviorSubject<MediaStream | null>(null);
  public localStream$ = this.localStreamBs.asObservable();
  private remoteStreamBs: BehaviorSubject<MediaStream | null> = new BehaviorSubject<MediaStream | null>(null);
  public remoteStream$ = this.remoteStreamBs.asObservable();

  // private localStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
  // public localStream$ = this.localStreamBs.asObservable();
  // private remoteStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
  // public remoteStream$ = this.remoteStreamBs.asObservable();


  private isCallStartedBs = new Subject<boolean>();
  public isCallStarted$ = this.isCallStartedBs.asObservable();

  constructor(private snackBar: MatSnackBar) {

   }


  // public initPeer() {
     
  //   if (!this.peer || this.peer.disconnected) {
  //     const peerJsOptions: Peer.PeerJSOption = {
  //       debug: 3,
  //       config: {
  //         iceServers: [
  //           {
  //             urls: [
  //               'stun:stun1.l.google.com:19302',
  //               'stun:stun2.l.google.com:19302',
  //             ],
  //           }
  //         ]
  //       }
  //     };
      
  //     try {
  //       let id = uuidv4();
  //       this.peer = new Peer(id, peerJsOptions);
  //       return id;
  //     } catch(error) {
  //       console.error(error);
  //     }


  //   }
  // }


  public initPeer() {
    if (!this.peer || this.peer.disconnected) {
        const peerJsOptions: Peer.PeerJSOption = {
            debug: 3,
            config: {
                iceServers: [
                    {
                        urls: [
                            'stun:stun1.l.google.com:19302',
                            'stun:stun2.l.google.com:19302',
                        ],
                    }]
            }
        };
        try {
            let id = uuidv4();
            this.peer = new Peer(id, peerJsOptions);
            return id;
        } catch (error) {
            console.error(error);
        }
        return;
    } else {
      return;
    }
}




  public async  establishMediaCall(remotePeerId: string)  {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});

      const connection = this.peer.connect(remotePeerId);
      connection.on('error', err => {
        console.error(err);
        this.snackBar.open(err, 'Close');
      });

      this.medialCall = this.peer.call(remotePeerId, stream);
      if (!this.medialCall) {
        let errorMessage = "Couldn't connect to the remote peer";
        this.snackBar.open(errorMessage, 'Close');
        throw new Error(errorMessage);
      }

      this.localStreamBs.next(stream);
      this.isCallStartedBs.next(true);

      this.medialCall.on('stream', (remoteStream) => {
        this.remoteStreamBs.next(remoteStream);
      });

      this.medialCall.on('error', err => {
        this.snackBar.open(err, 'Close');
        console.error(err);
        this.isCallStartedBs.next(false);
      });
      this.medialCall.on('close', () => this.onCallClose());
    } catch (ex) {
      console.error(ex);
      this.snackBar.open('ex', 'Close');
      this.isCallStartedBs.next(false);
    }
  } 


  public async enableCallAnswer() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
      this.localStreamBs.next(stream);
      this.peer.on('call', async (call) => {

        this.medialCall = call;
        this.isCallStartedBs.next(true);

        this.medialCall.answer(stream);
        this.medialCall.on('stream', (remoteStream) => {
          this.remoteStreamBs.next(remoteStream);
        });

        this.medialCall.on('error', err => {
          this.snackBar.open(err, 'Close');
          this.isCallStartedBs.next(false);
          console.error(err);
        });
        this.medialCall.on('close', () => this.onCallClose());
 
      });
    } catch(ex) {
      console.error(ex);
      this.snackBar.open('ex', 'Close');
      this.isCallStartedBs.next(false);
    }
  }


  private onCallClose() {

    if (this.remoteStreamBs?.value != null) {
      this.remoteStreamBs?.value.getTracks().forEach(track => {
        track.stop();
      });
    }

    if (this.localStreamBs?.value != null) {
      this.localStreamBs?.value.getTracks().forEach(track => {
        track.stop();
      });
    }
    this.snackBar.open('Call Has Ended', 'Close');

  }

  public closeMediaCall() {
    this.medialCall?.close();
    if (!this.medialCall) {
      this.onCallClose();
    }
    this.isCallStartedBs.next(false);
  }

  public destroyPeer() {
    this.medialCall?.close();
    this.peer?.disconnect();
    this.peer?.destroy();
  }



}
