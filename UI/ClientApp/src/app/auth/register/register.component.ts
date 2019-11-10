import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFormGroup: FormGroup;
  matcher: ErrorStateMatcher;

  constructor(private http: HttpClient) {
    this.registerFormGroup = new FormGroup({
      firstName: new FormControl('', [ Validators.required, Validators.minLength(7) ]),
      lastName: new FormControl('', [ Validators.required, Validators.minLength(7) ]),
      email: new FormControl('', [ Validators.required, Validators.email ]),
      passwordGroup: new FormGroup({
        password1: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
        password2: new FormControl('', [ Validators.required ])
      }, { validators: (formGroup: FormGroup): ValidationErrors | null => {
        return (formGroup.get('password1').value === formGroup.get('password2').value) ? null: { passwordMismatch: true }
      }})
    });

    this.matcher = new InstantErrorStateMatcher();
  }

  ngOnInit() {
    this.registerFormGroup.reset();
  }

  onPasswordInput() {
    const passGroup = this.registerFormGroup.get('passwordGroup');
    if (passGroup.hasError('passwordMismatch'))
      passGroup.get('password2').setErrors([{ 'passwordMismatch': true }]);
    else
    passGroup.get('password2').setErrors(null);
  }

  onRegister(event: MouseEvent) {
    const body = {
      FirstName: this.registerFormGroup.get('firstName').value,
      LastName: this.registerFormGroup.get('lastName').value,
      Email: this.registerFormGroup.get('email').value,
      Password: this.registerFormGroup.get('passwordGroup').get('password1').value,
    }
    this.http.post<User>('https://localhost:44377/api/User/register', body).subscribe(
      (data: any) => {
        if (data.succeeded) {
          this.registerFormGroup.reset();
        } else {
          data.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                // Username is already taken
                break;
            
              default:
                // Registration failed.
                break;
            }
          });
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  isFormInvalid() {
    return this.registerFormGroup.invalid;
  }
}

export class InstantErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control && control.invalid && (control.dirty || control.touched);
  }
}