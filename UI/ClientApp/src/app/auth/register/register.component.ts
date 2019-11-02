import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
        password1: new FormControl('', [ Validators.required, Validators.minLength(7) ]),
        password2: new FormControl('', [ Validators.required ])
      }, { validators: (formGroup: FormGroup): ValidationErrors | null => {
        return (formGroup.get('password1').value === formGroup.get('password2').value) ? null: { passwordMismatch: true }
      }})
    });

    this.matcher = new InstantErrorStateMatcher();
  }

  ngOnInit() {
  }

  onPasswordInput() {
    const passGroup = this.registerFormGroup.get('passwordGroup');
    if (passGroup.hasError('passwordMismatch'))
      passGroup.get('password2').setErrors([{ 'passwordMismatch': true }]);
    else
    passGroup.get('password2').setErrors(null);
  }

  onRegister(event: MouseEvent) {
    alert('clicked');
    //this.http.post('http://localhost:44377/api/Users', null);
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