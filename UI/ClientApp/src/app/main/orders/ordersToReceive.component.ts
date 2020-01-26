import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SatDatepickerRangeValue } from 'saturn-datepicker';
import { EnumService } from 'src/app/core/service/enum.service';
import { OrdersService } from './orders.service';
import { OrderFilters } from 'src/models/filters/order.filters.model';
import { OrderType } from 'src/models/enums/order.type.enum';

@Component({
  templateUrl: './ordersToReceive.component.html',
  styleUrls: ['./ordersToReceive.component.css']
})
export class OrdersToReceiveComponent implements OnInit {
  form: FormGroup;
  statuses: { code: string, des: string }[];
  types: { code: string, des: string }[];
  toReceive = [];

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
      orderType: OrderType.ToReceive,
      orderStatus: null,
      productType: null,
      date: null
    } as OrderFilters;
    this.orders.getOrders(filters).subscribe(
      (data: any[]) => {
        this.toReceive = [...data];
      },
      (error) => { }
    );
  }

  onFilterApplyClick(id: string) {
    alert(id);
  }

  onFilterClearClick(id: string) {
    alert(id);
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

  onOrderReceivedClick(id: string) {
    alert(id);
  }

  onOrderCancelledClick(id: string) {
    alert(id);
  }
}
