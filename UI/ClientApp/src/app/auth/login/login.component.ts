import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { AuthErrorStateMatcher } from '../auth.matcher';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  matcher: ErrorStateMatcher;

  constructor(private http: HttpClient, private toastr: ToastrService) {
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
        if (data.succeeded) {
          this.loginFormGroup.reset();
          // treat succesfull login
        } else {
          data.errors.forEach((element: { code: string, description: string }) => {
            // treat errors
          });
        }
      },
      (error) => {
        this.toastr.error('Login failed', 'Login failed');
      }
    );
  }

  isFormInvalid() {
    return this.loginFormGroup.invalid;
  }

}
