import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,  
  ) { }

  ngOnInit(): void {
  }


  onSignUp() {
    this.router.navigate(['/signup']);
  }

}
