import { Routes } from "@angular/router";
import { AuthenticationComponent } from "./authentication.component";
import { SignupComponent } from "./signup/signup.component";



export const AuthenticationRoutes: Routes = [
    { path: "", component: AuthenticationComponent },
    { path: "signup", component: SignupComponent },
]