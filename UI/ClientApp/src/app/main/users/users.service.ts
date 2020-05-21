import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { single } from 'rxjs/operators';
import { User } from 'src/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`https://localhost:44377/api/User/${id}`).pipe(single());
  }

  saveUser(user: User) {
    return this.http.post<User>('https://localhost:44377/api/User/update', user).pipe(single());
  }
}
