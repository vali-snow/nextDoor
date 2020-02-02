import { Component, OnInit } from '@angular/core';
import { EnumService } from 'src/app/core/service/enum.service';
import { OrdersService } from './orders.service';
import { OrderType } from 'src/models/enums/order.type.enum';
import { OrderFilters } from 'src/models/filters/order.filters.model';
import { FilterModel } from 'src/models/filters/filter.model';

@Component({
  templateUrl: './ordersToFulfill.component.html',
  styleUrls: ['./ordersToFulfill.component.css']
})
export class OrdersToFulfillComponent implements OnInit {
  toFulfill = [];
  filterModel: FilterModel = {
    title: 'Orders To Fulfill',
    description: 'Filter Panel',
    array: {
      search: { label: 'Search', type: 'text', size: 40 },
      productType: { label: 'Product Type', type: 'select', size: 20, options: this.enums.getKeysFromEnum('productType') },
      orderStatus: { label: 'Order Status', type: 'select', size: 20, options: this.enums.getKeysFromEnum('orderStatus') },
      dateRange: { label: 'Date Range', type: 'interval', size: 20 }
    }
  };

  constructor(private orders: OrdersService, private enums: EnumService) { }

  ngOnInit() {
    const filters = {
      orderType: OrderType.ToFulfill,
      search: null,
      orderStatus: null,
      productType: null,
      dateRange: null
    } as OrderFilters;
    this.orders.getOrders(filters).subscribe(
      (ords: any[]) => {
        this.toFulfill = [...ords];
      },
      (error) => { }
    );
  }

  onFiltersApply(values: any) {
    const filters: OrderFilters = new OrderFilters();
    filters.orderType = OrderType.ToFulfill;
    Object.keys(values).forEach(key => {
      switch (key) {
        case 'search':
          if (values[key] !== '') {
            filters[key] = values[key];
          }
          break;
        case 'productType':
          if (values[key] !== '') {
            filters[key] = this.enums.stringToType('productType', values[key]);
          }
          break;
        case 'orderStatus':
          if (values[key] !== '') {
            filters[key] = this.enums.stringToType('orderStatus', values[key]);
          }
          break;
        case 'dateRange':
          filters[key] = values[key];
          break;
      }
    });
    this.orders.getOrders(filters).subscribe(
      (ords: any[]) => {
        this.toFulfill = [...ords];
      },
      (error) => { }
    );
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
