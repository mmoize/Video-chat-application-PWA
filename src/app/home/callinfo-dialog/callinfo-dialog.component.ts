import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-callinfo-dialog',
  templateUrl: './callinfo-dialog.component.html',
  styleUrls: ['./callinfo-dialog.component.scss']
})
export class CallinfoDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CallinfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }


  public showCopiedSnackBar(){
    this._snackBar.open('Peer ID Copied!', 'Hurrah', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

}

export interface DialogData {
  [x: string]: any;
  peerId?: String| any;
  joinCall: boolean
}
