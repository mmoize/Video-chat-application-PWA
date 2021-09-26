import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "",
        loadChildren: () => import ("./home/home.module").then(m => m.HomeModule)
      }
    ]
  },
  {
    path: "",
    component: AuthenticationComponent,
    children: [
      {
        path: "auth",
        loadChildren: () => import ("./authentication/authentication.module").then(m => m. AuthenticationModule)
      }
    ]
  },
  { path: "signup", component: SignupComponent },
  {
    path: "**",
    redirectTo: "home"
  }
];

@NgModule({
  imports: [
    CommonModule,
   // BrowserModule,
    //RouterModule
    RouterModule.forRoot(routes, {
      useHash: false
    }),
    //RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
