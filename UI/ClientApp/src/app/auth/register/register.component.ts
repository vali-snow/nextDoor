import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { ErrorStateMatcher } from '@angular/material';
import { AuthErrorStateMatcher } from '../auth.matcher';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFormGroup: FormGroup;
  matcher: ErrorStateMatcher;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.registerFormGroup = new FormGroup({
      firstName: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      lastName: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      email: new FormControl('', [ Validators.required, Validators.email ]),
      passwordGroup: new FormGroup({
        password1: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
        password2: new FormControl('', [ Validators.required ])
      }, { validators: (formGroup: FormGroup): ValidationErrors | null => {
        return (formGroup.get('password1').value === formGroup.get('password2').value) ? null : { passwordMismatch: true };
      }})
    });

    this.matcher = new AuthErrorStateMatcher();
  }

  ngOnInit() {
    this.registerFormGroup.reset();
  }

  onPasswordInput() {
    const passGroup = this.registerFormGroup.get('passwordGroup');
    if (passGroup.hasError('passwordMismatch')) {
      passGroup.get('password2').setErrors([{ 'passwordMismatch': true }]);
    } else {
      passGroup.get('password2').setErrors(null);
    }
  }

  onRegister(event: MouseEvent) {
    const body = {
      FirstName: this.registerFormGroup.get('firstName').value,
      LastName: this.registerFormGroup.get('lastName').value,
      Email: this.registerFormGroup.get('email').value,
      Password: this.registerFormGroup.get('passwordGroup').get('password1').value,
    };
    this.http.post<User>('https://localhost:44377/api/User/register', body).subscribe(
      (data: any) => {
        if (data.succeeded) {
          this.registerFormGroup.reset();
          this.toastr.success('New user created', 'Registration successfull');
        } else {
          data.errors.forEach((element: { code: string, description: string }) => {
            switch (element.code) {
              case 'DuplicateUserName':
                break;
              default:
                this.toastr.error(element.description, 'Registration failed');
                break;
            }
          });
        }
      },
      (error) => {
        this.toastr.error('Registration failed', 'Registration failed');
      }
    );
  }

  isFormInvalid() {
    return this.registerFormGroup.invalid;
  }
}
