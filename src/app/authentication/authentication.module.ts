import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutes } from './authentication.routing';
import { RouterModule } from '@angular/router';

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
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics())
  ],
  providers: [AuthService,],
})
export class AuthenticationModule { }
