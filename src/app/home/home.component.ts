import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, filter, scan, switchMap } from 'rxjs/operators';
import { CallService } from '../call.service';
import { CallinfoDialogComponent, DialogData } from './callinfo-dialog/callinfo-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public isCallStarted$: Observable<boolean>;
  private peerId: String;


  


  @ViewChild('localVideo')localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;


  constructor(
    public dialog: MatDialog, 
    private callService: CallService 
  ) { 

    this.isCallStarted$ = this.callService.isCallStarted$;
    this.peerId = this.callService.initPeer();

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

