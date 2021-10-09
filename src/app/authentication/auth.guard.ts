
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor( private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Promise<boolean>  {

    let url: string = state.url;
    const result = this.returnUserDetails();

    if (!result) {
      this.router.navigate(['/login']);
    }

    return result;
      // return this.authService.userIsAuthenticated.pipe(take(1),
      // switchMap(isAuthenticated => {
      //   if (!isAuthenticated) {
      //     console.log(' num 1')

      //     if (this.returnUserDetails() === null) {
      //       return of(isAuthenticated);
      //     } else {
      //       return this.authService.autoLogin();
      //     }

      //   } else {
      //     console.log(' num 2')
      //     return of(isAuthenticated);
      //   }

      // }),
      //  tap(isAuthenticated => {
      //   console.log(' num 3')
      //   if (!isAuthenticated) {
      //     console.log(' num 4')
      //     this.router.navigateByUrl('auth');
      //   }
      // }));
    }

    async returnUserDetails() {
     //const value = await JSON.parse(localStorage.getItem('user') || '{}');
     const value = await localStorage.getItem('user') ;
      console.log("security value", value)
  
      if (value === null) {
        console.log("security value", value)
        this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
    }

}

