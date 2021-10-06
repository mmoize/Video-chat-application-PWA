import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  form!: FormGroup;

  constructor(
    public authService: AuthService,
    public router: Router,  
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      username: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: []
      }),
      token: new FormControl(null, {
        updateOn: 'change',
        validators: []
      }),
    });

  }


  onSignUp() {
    this.router.navigate(['/signup']);
  }



  onSubmit() {

    console.log("password", this.form.value.password)
    console.log("username", this.form.value.email)

    if (!this.form.value.password) {
      return;
    }
    const email =  this.form.value.email;
    const password =  this.form.value.password;

    try {

      this.authService.emailLogin(email, password).then(resData => {
        console.log("new login response data", resData);

        if (resData != undefined) {
          this.router.navigate(['/chat']);
        }

      });
    }
    catch(error) {
      console.log("Error found", error)
    }

  }


  onSubmitSignup() {


    if (!this.form.value.password) {
      return;
    }
    const username =  this.form.value.username;
    const email =  this.form.value.email;
    const password =  this.form.value.password;

    try {

      this.authService.emailSignUp(email, password, username).then(resData => {
        console.log("new signupresponse data", resData);

        if (resData != undefined) {
          this.router.navigate(['/chat']);
        }

      });
    }
    catch(error) {
      console.log("Error found", error)
    }

  }


}
