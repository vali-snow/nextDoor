import { Component, OnInit } from '@angular/core';
import { SatDatepickerRangeValue } from 'saturn-datepicker';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OrderStatus } from 'src/models/enums/orderstatus.enum';
import { ProductType } from 'src/models/enums/producttype.enums';

@Component({
  templateUrl: './ordersToFulfill.component.html',
  styleUrls: ['./ordersToFulfill.component.css']
})
export class OrdersToFulfillComponent implements OnInit {
  form: FormGroup;
  statuses = this.getKeysFromEnum('statuses');
  types = this.getKeysFromEnum('types');

  toFulfill = [];

  constructor(private http: HttpClient, private builder: FormBuilder) {
    this.form = builder.group({
      type: null,
      status: null,
      date: [{begin: null, end: null} as SatDatepickerRangeValue<Date>]
    });
  }

  ngOnInit() {
    this.http.get( 'https://localhost:44377/api/Orders').subscribe(
      (data: any[]) => {
        this.toFulfill = [...data];
      },
      (error) => {
        // if (error.status === 400) {
        //   this.toastr.error(error.error.message, 'Login failed');
        // } else {
        //   console.log(error);
        // }
      }
    );
  }

  typeToString(enumStr: string, num: number) {
    let enumObj;
    switch (enumStr) {
      case 'statuses':
        enumObj = OrderStatus;
        break;
      case 'types':
        enumObj = ProductType;
        break;
    }
    return enumObj[num];
  }

  getKeysFromEnum(enumStr: string) {
    const keys = Object.keys;
    let enumObj;
    switch (enumStr) {
      case 'statuses':
        enumObj = OrderStatus;
        break;
      case 'types':
        enumObj = ProductType;
        break;
    }
    const values = [];
    keys(enumObj).filter(key => parseInt(key, 10) >= 0).forEach(key => {
      values.push({'code': key, 'des': enumObj[key]});
    });

    return values;
  }

  onFilterApplyClick() {

  }

  onFilterClearClick() {
    this.form.setValue({
      type: 'any',
      status: 'any',
      date: {begin: null, end: null} as SatDatepickerRangeValue<Date>
    });
  }

  onProductDetailClick(id: string) {
    alert(id);
  }

  onUserDetailClick(id: string) {
    alert(id);
  }

  onOrderDetailClick(id: string) {
    alert(id);
  }

  onOrderCompletedClick(id: string) {
    alert(id);
  }

  onOrderCancelledClick(id: string) {
    alert(id);
  }
}
