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
  private backURL = 'main/dash';

  @ViewChild('filtersForm', { static: false }) filtersForm: FormComponent;
  constructor(private route: ActivatedRoute, private usersService: UsersService, private router: Router,
              private toastr: ToastrService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state.backURL) {
      this.backURL = this.router.getCurrentNavigation().extras.state.backURL;
    }
  }

  ngOnInit() {
    this.user = this.route.snapshot.data.user;
    this.generateFormTemplate(this.user);
    this.generateButtons(this.user);
  }

  generateFormTemplate(user: User) {
    this.rows = [
      {
        name: {
          label: 'FirstName',
          type: 'text',
          size: '50',
          disabled: true,
          value: user.FirstName
        },
        seller: {
          label: 'LastName',
          type: 'text',
          size: '50',
          disabled: true,
          value: user.LastName
        }
      },
      {
        productType: {
          label: 'Email',
          type: 'text',
          size: '50',
          disabled: true,
          value: user.Email
        },
        quantity: {
          label: 'PhoneNumber',
          type: 'text',
          size: '50',
          disabled: true,
          value: user.PhoneNumber,
        }
      }
    ];
  }

  generateButtons(user: User) {

  }

  onClick(buttonKey: string) {
    switch (buttonKey) {
      case 'back':
        this.router.navigate([this.backURL]);
        break;
      default:
        break;
    }
  }
}
