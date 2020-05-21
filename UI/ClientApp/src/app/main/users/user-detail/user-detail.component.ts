import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormComponent } from '../../common/form/form.component';
import { UsersService } from '../users.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  rows = [];
  buttons = {};
  user: User;
  editable = false;
  initial: {
    firstName: string,
    lastName: string,
    phoneNumber: string
  };
  private backURL = 'main/dash';

  @ViewChild('userForm', { static: false }) userForm: FormComponent;
  constructor(private route: ActivatedRoute, private usersService: UsersService, private router: Router,
    private toastr: ToastrService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state.backURL) {
      this.backURL = this.router.getCurrentNavigation().extras.state.backURL;
    }
  }

  ngOnInit() {
    this.user = this.route.snapshot.data.user;
    this.backupEditableValues(this.user);
    this.generateFormTemplate(this.user);
    this.generateButtons(this.user);
  }

  backupEditableValues(user: User) {
    this.initial = {
      firstName: user.FirstName,
      lastName: user.LastName,
      phoneNumber: user.PhoneNumber
    };
  }

  generateFormTemplate(user: User) {
    this.rows = [
      {
        firstName: {
          label: 'First Name',
          type: 'text',
          size: '50',
          disabled: true,
          value: user.FirstName
        },
        lastName: {
          label: 'Last Name',
          type: 'text',
          size: '50',
          disabled: true,
          value: user.LastName
        }
      },
      {
        email: {
          label: 'Email',
          type: 'text',
          size: '50',
          disabled: true,
          value: user.Email
        },
        phoneNumber: {
          label: 'Phone Number',
          type: 'text',
          size: '50',
          disabled: true,
          value: user.PhoneNumber,
        }
      }
    ];
  }

  generateButtons(user: User) {
    const userId = localStorage.getItem('userId');
    if (user.Id === userId) {
      this.buttons = {
        save: {
          order: 1,
          label: 'Save',
          icon: 'save',
          disabled: true,
        },
        edit: {
          order: 2,
          label: 'Edit',
          icon: 'edit',
          disabled: false,
        }
      };
    }
  }

  onClick(buttonKey: string) {
    switch (buttonKey) {
      case 'save':
        if (!this.validateValuesFromForm()) {
          return;
        }
        this.updateValuesFromForm();
        this.usersService.saveUser(this.user).subscribe(
          (usr: User) => {
            this.user = usr;
            this.backupEditableValues(this.user);
            this.editable = false;
            this.userForm.getFormObj('firstName').disabled = !this.editable;
            this.userForm.getFormObj('lastName').disabled = !this.editable;
            this.userForm.getFormObj('phoneNumber').disabled = !this.editable;
            this.buttons['save'].disabled = !this.editable;
            this.toastr.success('User details save successful', 'Save successful');
          },
          (error: any) => {
            this.toastr.error('User details save failed', 'Save failed');
            console.log(error);
          }
        );
        break;
      case 'edit':
        this.editable = !this.editable;
        this.userForm.getFormObj('firstName').disabled = !this.editable;
        this.userForm.getFormObj('lastName').disabled = !this.editable;
        this.userForm.getFormObj('phoneNumber').disabled = !this.editable;
        if (!this.editable) {
          this.userForm.form.patchValue({
            firstName: this.initial.firstName,
            lastName: this.initial.lastName,
            phoneNumber: this.initial.phoneNumber
          });
        }
        this.buttons['save'].disabled = !this.editable;
        break;
      case 'back':
        this.router.navigate([this.backURL]);
        break;
      default:
        break;
    }
  }

  validateValuesFromForm(): boolean {
    let valid = true;
    if ((this.userForm.form.get('firstName').value as string).length < 3) {
      this.toastr.error('Please enter a first name with length grater than 3.', 'Save failed');
      valid = false;
    }
    if ((this.userForm.form.get('lastName').value as string).length < 3) {
      this.toastr.error('Please enter a last name with length grater than 3.', 'Save failed');
      valid = false;
    }
    const re = new RegExp('^([+0-9][ 0-9]*[0-9])$');
    if (!re.test(this.userForm.form.get('phoneNumber').value as string) ||
        (this.userForm.form.get('phoneNumber').value as string).length < 3) {
      this.toastr.error('Please enter a valid phone number. Minimum 3 digits.', 'Save failed');
      valid = false;
    }
    return valid;
  }

  updateValuesFromForm() {
    this.user.FirstName = this.userForm.form.get('firstName').value;
    this.user.LastName = this.userForm.form.get('lastName').value;
    this.user.PhoneNumber = this.userForm.form.get('phoneNumber').value;
  }

  getInOrder(a, b) {
    return a.order > b.order ? a : b;
  }
}
