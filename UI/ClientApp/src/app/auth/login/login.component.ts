import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { AuthErrorStateMatcher } from '../auth.matcher';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  matcher: ErrorStateMatcher;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.required ])
    });

    this.matcher = new AuthErrorStateMatcher();
  }

  ngOnInit() {
  }

  onLogin(event: MouseEvent) {
    const body = {
      Email: this.loginFormGroup.get('email').value,
      Password: this.loginFormGroup.get('password').value,
    };
    this.http.post<User>('https://localhost:44377/api/User/login', body).subscribe(
      (data: any) => {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('authToken', data.token);
        this.router.navigate(['main/dash']);
        this.toastr.success('Login successful', 'Login successful');
      },
      (error) => {
        if (error.status === 401) {
          this.toastr.error('Username or password is incorrect', 'Login failed');
        } else {
          console.log(error);
        }
      }
    );
  }

  isFormInvalid() {
    return this.loginFormGroup.invalid;
  }

}
