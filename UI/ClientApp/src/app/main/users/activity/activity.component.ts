import { Component, OnInit, Input } from '@angular/core';
import { Activity } from 'src/models/activity.model';
import { ActivityType } from 'src/models/enums/activity.type.enum';
import { EnumService } from 'src/app/core/service/enum.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  @Input() activity: Activity[];
  constructor(private enums: EnumService, private router: Router) { }

  ngOnInit() {
  }

  getColor(type: ActivityType) {
    switch (this.enums.typeToString('activityType', type)) {
      case 'AccountCreate':
      case 'ProductCreate':
      case 'OrderPlace':
        return 'accent';
      case 'AccountUpdate':
      case 'ProductEdit':
      case 'OrderReveive':
      case 'OrderFulfill':
        return 'primary';
      case 'ProductRemove':
      case 'OrderCancel':
        return 'warn';
    }
  }

  getIcon(type: ActivityType) {
    switch (this.enums.typeToString('activityType', type)) {
      case 'AccountCreate':
      case 'AccountUpdate':
        return 'account_box';
      case 'ProductCreate':
      case 'ProductEdit':
      case 'ProductRemove':
        return 'redeem';
      case 'OrderPlace':
      case 'OrderReveive':
      case 'OrderFulfill':
      case 'OrderCancel':
        return 'shopping_basket';
    }
  }

  onActivityClick(type: ActivityType, id: string) {
    const userId = localStorage.getItem('userId');
    switch (this.enums.typeToString('activityType', type)) {
      case 'AccountCreate':
      case 'AccountUpdate':
        break;
      case 'ProductCreate':
      case 'ProductEdit':
      case 'ProductRemove':
        this.router.navigate(['main/product-detail', id], { state: { backURL: `main/user-detail/${userId}` } });
        break;
      case 'OrderPlace':
      case 'OrderReveive':
      case 'OrderFulfill':
      case 'OrderCancel':
        this.router.navigate(['main/order-detail', id], { state: { backURL: `main/user-detail/${userId}` } });
        break;
    }
  }
}
