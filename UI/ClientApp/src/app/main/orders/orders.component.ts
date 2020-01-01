import { Component, OnInit } from '@angular/core';
import { SatDatepickerRangeValue } from 'saturn-datepicker';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Order } from 'src/models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  form: FormGroup;
  types: any[] = [
    {code: 'any', des: 'Any'},
    {code: 'goods', des: 'Goods'},
    {code: 'services', des: 'Services'}
  ];
  statuses: any[] = [
    {code: 'any', des: 'Any'},
    {code: 'open', des: 'Open'},
    {code: 'completed', des: 'Completed'}
  ];
  foods: any[] = [
    {value: null, viewValue: 'None'},
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  myOrders: Order[] = [];

  constructor(private http: HttpClient, private builder: FormBuilder) {
    this.form = builder.group({
      type: ['any'],
      status: ['any'],
      date: [{begin: null, end: null} as SatDatepickerRangeValue<Date>]
    });
  }

  ngOnInit() {
    this.http.get('https://localhost:44377/api/Orders').subscribe(
      (data: any[]) => {
        this.myOrders.length = 0;
        data.forEach((o: any) => {
          const order = {
            Id: o.id,
            Product: o.product,
            Quantity: o.quantity,
            Status: o.status,
            DeliverToUser: o.deliverToUser,
            DeliverToAddress: o.deliverToAddress,
            DeliveryToPhoneNumber: o.deliveryToPhoneNumber,
            StartDate: new  Date (o.startDate),
            EndDate: new  Date (o.endDate)
          } as Order;
          this.myOrders.push(order);
        });
      },
      (error) => {
        debugger;
        // if (error.status === 400) {
        //   this.toastr.error(error.error.message, 'Login failed');
        // } else {
        //   console.log(error);
        // }
      }
    );
  }

}
