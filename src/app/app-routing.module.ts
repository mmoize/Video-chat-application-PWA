import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "video",
    pathMatch: "full"
  },
  // {
  //   path: "",
  //   loadChildren: () => import ("./home/home.module").then(m => m.HomeModule)
  // },
  // {
  //   path: "",
  //   loadChildren: () => import ("./authentication/authentication.module").then(m => m. AuthenticationModule)
  // },
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "",
        loadChildren: () => import ("./home/home.module").then(m => m.HomeModule), canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: "",
    component: AuthenticationComponent,
    children: [
      {
        path: "",
        loadChildren: () => import ("./authentication/authentication.module").then(m => m. AuthenticationModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "chat"
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
