import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { CallinfoDialogComponent } from './callinfo-dialog/callinfo-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ChatroomComponent } from './chat/chatroom/chatroom.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { HomeRoutes } from './home.routing';
import { DatePipe } from '@angular/common';

import { provideFirebaseApp, initializeApp } 
from '@angular/fire/app';
import { getAuth, provideAuth } 
from '@angular/fire/auth';
import { getFirestore, provideFirestore } 
from '@angular/fire/firestore';
import { getStorage, provideStorage } 
from '@angular/fire/storage';
import { getAnalytics, provideAnalytics } 
from '@angular/fire/analytics';
import { environment } from 'src/environments/environment';
import { UpdateProfileComponent } from './chat/update-profile/update-profile.component';
import { VideoComponent } from './video/video.component';
import { GroupchatComponent } from './chat/groupchat/groupchat.component';
import { ProfileComponent } from './profile/profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';




@NgModule({
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics()),

    CommonModule,
    RouterModule.forChild(HomeRoutes),
    FormsModule ,
    ReactiveFormsModule,
    //AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
    MatSnackBarModule,
    MatIconModule,
    NgxMaterialSpinnerModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCardModule,
    MatSidenavModule,
    MatSortModule,
    FlexLayoutModule
  ],
  providers: [DatePipe],
  declarations: [
    CallinfoDialogComponent,
    ChatComponent,
    AddroomComponent,
    ChatroomComponent,
    UpdateProfileComponent,
    VideoComponent,
    GroupchatComponent,
    ProfileComponent,

  ],
})
export class HomeModule { }
