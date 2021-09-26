import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { CallinfoDialogComponent } from './callinfo-dialog/callinfo-dialog.component';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatComponent } from './chat/chat.component';
import { MatIconModule } from '@angular/material/icon'
import { AppRoutingModule } from '../app-routing.module';
import { NgxMaterialSpinnerModule } from "ngx-material-spinner";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddroomComponent } from './chat/addroom/addroom.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatroomComponent } from './chat/chatroom/chatroom.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { HomeRoutes } from './home.routing';





@NgModule({
  declarations: [
    CallinfoDialogComponent,
    ChatComponent,
    AddroomComponent,
    ChatroomComponent
  ],
  imports: [
    CommonModule,
    FormsModule ,
    RouterModule.forChild(HomeRoutes),
    //AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
    MatSnackBarModule,
    MatIconModule,
    NgxMaterialSpinnerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCardModule,
    MatSidenavModule,
    MatSortModule,
    MatFormFieldModule 
  ],
  providers: [ ],
})
export class HomeModule { }
