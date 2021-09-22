import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallinfoDialogComponent } from './callinfo-dialog/callinfo-dialog.component';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';





@NgModule({
  declarations: [
    CallinfoDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule ,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
    MatSnackBarModule
  ]
})
export class HomeModule { }
