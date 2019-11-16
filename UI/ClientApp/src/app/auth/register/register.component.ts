import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models/user.model';
import { ToastrService } from 'ngx-toastr';

export class InstantErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control && control.invalid && (control.dirty || control.touched);
  }
}

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
      firstName: new FormControl('', [ Validators.required, Validators.minLength(7) ]),
      lastName: new FormControl('', [ Validators.required, Validators.minLength(7) ]),
      email: new FormControl('', [ Validators.required, Validators.email ]),
      passwordGroup: new FormGroup({
        password1: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
        password2: new FormControl('', [ Validators.required ])
      }, { validators: (formGroup: FormGroup): ValidationErrors | null => {
        return (formGroup.get('password1').value === formGroup.get('password2').value) ? null : { passwordMismatch: true };
      }})
    });

    this.matcher = new InstantErrorStateMatcher();
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
            this.toastr.error(element.description, 'Registration failed');
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
