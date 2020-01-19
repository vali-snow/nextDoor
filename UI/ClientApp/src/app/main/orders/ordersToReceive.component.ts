import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SatDatepickerRangeValue } from 'saturn-datepicker';
import { OrderStatus } from 'src/models/enums/orderstatus.enum';
import { ProductType } from 'src/models/enums/producttype.enums';

@Component({
  templateUrl: './ordersToReceive.component.html',
  styleUrls: ['./ordersToReceive.component.css']
})
export class OrdersToReceiveComponent implements OnInit {
  form: FormGroup;
  statuses = this.getKeysFromEnum('statuses');
  types = this.getKeysFromEnum('types');
  toReceive = [];

  constructor(private http: HttpClient, private builder: FormBuilder) {
    this.form = builder.group({
      type: null,
      status: null,
      date: [{ begin: null, end: null } as SatDatepickerRangeValue<Date>]
    });
  }

  ngOnInit() {
    this.http.get('https://localhost:44377/api/Orders/ToReceive').subscribe(
      (data: any[]) => {
        this.toReceive = [...data];
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
      values.push({ 'code': key, 'des': enumObj[key] });
    });

    return values;
  }

}
