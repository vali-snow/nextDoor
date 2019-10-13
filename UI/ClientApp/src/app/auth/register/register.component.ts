import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  usernameFormControl: FormControl;
  emailFormControl: FormControl;
  passwordFormControl: FormControl;
  matcher: ErrorStateMatcher;

  constructor() {
    this.usernameFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(7),
    ]);
    this.emailFormControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
    this.passwordFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(7)
    ]);
  
    this.matcher = new InstantErrorStateMatcher();
  }

  ngOnInit() { }

}

export class InstantErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid);
  }
}