import { Component, OnInit } from '@angular/core';
import { SatDatepickerRangeValue } from 'saturn-datepicker';
import { FormGroup, FormBuilder } from '@angular/forms';

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

  constructor(private builder: FormBuilder) {
    this.form = builder.group({
      type: ['any'],
      status: ['any'],
      date: [{begin: null, end: null} as SatDatepickerRangeValue<Date>]
    });
  }

  ngOnInit() {
  }

}
