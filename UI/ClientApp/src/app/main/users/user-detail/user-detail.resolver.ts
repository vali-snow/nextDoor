import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.model';
import { map } from 'rxjs/operators';

@Injectable()
export class UserDetailResolver implements Resolve<any> {
  constructor(private usersService: UsersService) {}

  resolve( route: ActivatedRouteSnapshot): Observable<any>|Promise<any>|any {
    const id = route.paramMap.get('id');
    return this.usersService.getUser(id).pipe(map(
      (u: User) => {
        return {
          Id: u.Id,
          FirstName: u.FirstName,
          LastName: u.LastName,
          Email: u.Email,
          PhoneNumber: u.PhoneNumber,
          Activity: u.Activity
        } as User;
      }
    ));
  }
}
