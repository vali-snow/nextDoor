import { Component, OnInit } from '@angular/core';
import { SatDatepickerRangeValue } from 'saturn-datepicker';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { EnumService } from 'src/app/core/service/enum.service';
import { OrdersService } from './orders.service';
import { OrderType } from 'src/models/enums/order.type.enum';
import { OrderFilters } from 'src/models/filters/order.filters.model';
import { OrderStatus } from 'src/models/enums/order.status.enum';

@Component({
  templateUrl: './ordersToFulfill.component.html',
  styleUrls: ['./ordersToFulfill.component.css']
})
export class OrdersToFulfillComponent implements OnInit {
  form: FormGroup;
  statuses: any;
  types: any;
  toFulfill = [];

  constructor(private orders: OrdersService, private builder: FormBuilder, private enums: EnumService) {
    this.statuses = this.enums.getKeysFromEnum('statuses');
    this.types = this.enums.getKeysFromEnum('types');
    this.form = builder.group({
      type: null,
      status: null,
      date: [{ begin: null, end: null } as SatDatepickerRangeValue<Date>]
    });
  }

  ngOnInit() {
    const filters = {
      orderType: OrderType.ToFulfill,
      orderStatus: null,
      productType: null,
      date: null
    } as OrderFilters;
    this.orders.getOrders(filters).subscribe(
      (data: any[]) => {
        this.toFulfill = [...data];
      },
      (error) => { }
    );
  }

  onFilterApplyClick() {
    const filters = {
      orderType: OrderType.ToFulfill,
      orderStatus: this.form.get('status').value,
      productType: this.form.get('type').value,
      date: {
        start: this.form.get('date').value.begin,
        end: this.form.get('date').value.end
      }
    } as OrderFilters;
    this.orders.getOrders(filters).subscribe(
      (data: any[]) => {
        this.toFulfill = [...data];
      },
      (error) => { }
    );
  }

  onFilterClearClick() {
    this.form.setValue({
      type: null,
      status: null,
      date: { begin: null, end: null } as SatDatepickerRangeValue<Date>
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
