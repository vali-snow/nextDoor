import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiresLogin = next.data.requiresLogin || false;
    if (requiresLogin && localStorage.getItem('authToken') === null) {
      this.router.navigate(['auth/login']);
    }
    return true;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiresLogin = next.data.requiresLogin || false;
    if (requiresLogin && localStorage.getItem('authToken') === null) {
      this.router.navigate(['auth/login']);
    }
    return true;
  }
}
