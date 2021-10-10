import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatIconModule } from '@angular/material/icon'
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HomeComponent } from './home/home.component';
import { list } from '@angular/fire/database';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from 'ngx-toastr';

import { provideFirebaseApp, initializeApp } 
from '@angular/fire/app';
import { getAuth, provideAuth } 
from '@angular/fire/auth';
import { getFirestore, provideFirestore } 
from '@angular/fire/firestore';
import { getDatabase, provideDatabase } 
from '@angular/fire/database';
import { getStorage, provideStorage } 
from '@angular/fire/storage';
import { getAnalytics, provideAnalytics } 
from '@angular/fire/analytics';


import { AuthenticationComponent } from './authentication/authentication.component';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from './authentication/auth.service';
import { ChatComponent } from './home/chat/chat.component';
import { CallService } from './call.service';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ComponentsModule } from './components/components.module';
import { MakeVideoCallModalComponent } from './modals/make-video-call-modal/make-video-call-modal.component';
import { ReceiveVideoCallModalComponent } from './modals/receive-video-call-modal/receive-video-call-modal.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';









@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticationComponent,
    MakeVideoCallModalComponent, 
    ReceiveVideoCallModalComponent, SplashScreenComponent

  
  

  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics()),
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
    MatSnackBarModule,
    NgbModule,
    MatIconModule,
    ComponentsModule,
    ToastrModule.forRoot({
      
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      //registrationStrategy: 'registerImmediately'
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [AuthService, CallService, DatePipe],
  bootstrap: [AppComponent],
  exports:[MakeVideoCallModalComponent, ReceiveVideoCallModalComponent]
})
export class AppModule {


  
 }
