import { Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { EnumService } from 'src/app/core/service/enum.service';
import { FilterModel } from 'src/models/filters/filter.model';
import { OrderFilters } from 'src/models/filters/order.filters.model';
import { OrderType } from 'src/models/enums/order.type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  ordersType: string = this.route.snapshot.data.show;
  orders: Order[] = [];
  filterModel: FilterModel = {
    title: this.route.snapshot.data.title,
    description: 'Filter Panel',
    array: {
      search: { label: 'Search', type: 'text', size: 40 },
      productType: { label: 'Product Type', type: 'select', size: 20, options: this.enums.getKeysFromEnum('productType') },
      orderStatus: { label: 'Order Status', type: 'select', size: 20, options: this.enums.getKeysFromEnum('orderStatus') },
      dateRange: { label: 'Date Range', type: 'interval', size: 20 }
    }
  };

  constructor(private ordersService: OrdersService, private enums: EnumService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.orders = this.route.snapshot.data.orders;
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
    this.ordersService.getOrders(filters).subscribe(
      (ords: any[]) => {
        this.orders = [...ords];
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
